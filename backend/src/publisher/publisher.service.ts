import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Job } from 'src/entities/job.entity';
import { Post } from 'src/entities/post.entity';
import { Notification } from 'src/entities/notification.entity';
import { AuditLog } from 'src/entities/audit-log.entity';
import { WebhooksService } from 'src/webhooks/webhooks.service';
import { PostTarget } from 'src/entities/post-target.entity';
import { SocialAccount } from 'src/entities/social-account.entity';
import { AccountToken } from 'src/entities/account-token.entity';
import { ProviderFactory } from './providers/provider.factory';

@Injectable()
export class PublisherService implements OnModuleInit {
  // Logger → log to console/Nest logs.
  // timer → the setInterval handle (background job runner).
  // maxAttempts = 5 → each job can be retried up to 5 times before permanently failing.
  private readonly log = new Logger(PublisherService.name);
  private timer?: NodeJS.Timeout;
  private readonly maxAttempts = 5;

  // em → MikroORM EntityManager for DB queries.
  // webhooks → service to emit internal/external events.
  // providers → factory that returns the correct provider adapter (twitterProvider, instagramProvider, etc.).
  constructor(
    private readonly em: EntityManager,
    private readonly webhooks: WebhooksService,
    private readonly providers: ProviderFactory,
  ) {}

  // When Nest starts this module, it starts a loop (tick()) every 5 seconds.
  // tick() is where pending jobs are checked and processed.
  onModuleInit(): void {
    this.log.log('Starting publisher service...');
    this.timer = setInterval(() => void this.tick(), 5_000);
  }

  private async tick(): Promise<void> {
    // Creates a forked EM → safe for background usage.
    const em = this.em.fork();
    const now = new Date();

    // Finds up to 10 jobs that are pending and ready (scheduledAt <= now).
    // Populates relations → so each job comes with its post, target, and social account.
    const jobs = await em.find(
      Job,
      { status: 'pending', scheduledAt: { $lte: now } },
      {
        limit: 10,
        orderBy: { scheduledAt: 'ASC' },
        populate: ['post', 'target', 'target.socialAccount'],
      },
    );

    if (jobs.length === 0) return;

    for (const job of jobs) {
      try {
        // Marks job as processing.
        job.status = 'processing';

        // Flush writes this change to DB immediately.
        await em.flush();

        // Each job must be tied to a post + target.
        // If not found → fail the job.
        const post = job.post;
        if (!post) {
          job.status = 'failed';
          job.lastError = 'Post not found';
          await em.flush();
          continue;
        }

        // Each job must be tied to a post + target.
        // If not found → fail the job.
        const target = job.target;
        if (!target) {
          job.status = 'failed';
          job.lastError = 'PostTarget not found for job';
          await em.flush();
          continue;
        }

        const account = target.socialAccount as SocialAccount;

        // Fetch latest non-revoked access token (decrypt as needed)
        const token = await em.findOne(
          AccountToken,
          {
            account,
            tokenType: 'access',
            revoked: false,
          },
          { orderBy: { createdAt: 'DESC' } },
        );
        if (!token) {
          job.status = 'failed';
          target.status = 'failed';
          target.lastError = 'Access token not found';
          await em.flush();
          continue;
        }
        // let's make the decrypt happen here
        const accessToken = token.tokenEncrypted; // TODO: decrypt

        // Move target to processing
        target.status = 'processing';
        await em.flush();

        // Prepare provider input
        const text = [post.contentAr, post.contentEn]
          .filter(Boolean)
          .join('\n');
        const publisher = this.providers.get(account.provider);

        // Call provider (real implementation to be added in adapters)
        const result = await publisher.publish({
          text,
          mediaUrls: undefined, // TODO: pre-upload media and pass provider IDs/URLs
          scheduledAt: undefined,
          accessToken,
          providerAccountId: account.providerAccountId,
        });

        // Success for this target
        target.status = 'success';
        target.externalPostId = result.externalPostId;
        target.externalUrl = result.externalUrl;
        target.publishedAt = result.publishedAt ?? new Date();
        target.updatedAt = new Date();

        job.status = 'success';
        job.executedAt = new Date();
        await em.flush();

        // Recompute aggregate post status based on all targets
        await this.aggregatePostStatus(em, post);
      } catch (e) {
        const err = e as Error;
        this.log.error(`Publish failed for job ${job.id}: ${err.message}`);
        job.lastError = err.message;
        job.attempt += 1;
        // Update target failure state
        const target = job.target;
        if (target) {
          target.status = 'failed';
          target.lastError = job.lastError;
          target.attempt += 1;
        }

        if (job.attempt >= this.maxAttempts) {
          job.status = 'failed';
        } else {
          job.status = 'pending';
          // exponential backoff: now + 2^attempt * 1s
          const delayMs = 1000 * 2 ** Math.min(job.attempt, 8);
          job.scheduledAt = new Date(Date.now() + delayMs);
        }
        await em.flush();

        const post = job.post;
        if (post) {
          await this.aggregatePostStatus(em, post);

          // simple notification + audit log (no team linkage yet)
          if (job.status === 'failed') {
            const notif = em.create(Notification, {
              user: post.author,
              type: 'publish_failed',
              payload: { postId: post.id, error: job.lastError },
              read: false,
              createdAt: new Date(),
            });
            em.persist(notif);
            const log = em.create(AuditLog, {
              user: post.author,
              action: 'post.publish_failed',
              entityType: 'post',
              entityId: String(post.id),
              details: { error: job.lastError },
              timestamp: new Date(),
            });
            em.persist(log);
            await em.flush();
          }
        }
      }
    }
  }

  private async aggregatePostStatus(
    em: EntityManager,
    post: Post,
  ): Promise<void> {
    const targets = await em.find(PostTarget, { post: post.id });
    const total = targets.length;
    const success = targets.filter((t) => t.status === 'success').length;
    const processing = targets.some((t) => t.status === 'processing');
    const pendingOrScheduled = targets.some(
      (t) => t.status === 'pending' || t.status === 'scheduled',
    );
    const failedOnly =
      success === 0 && !processing && !pendingOrScheduled && total > 0;

    if (total > 0 && success === total) {
      post.status = 'published';
      post.publishedAt = new Date();
      await em.flush();
      await this.webhooks.emitInternal('post.published', {
        postId: post.id,
        status: post.status,
      });
      return;
    }
    if (processing || pendingOrScheduled) {
      post.status = 'scheduled';
      post.publishedAt = undefined;
      await em.flush();
      return;
    }
    if (failedOnly) {
      post.status = 'failed';
      post.publishedAt = undefined;
      await em.flush();
    }
  }
}
