import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EntityManager, RequestContext } from '@mikro-orm/core';
import { Job } from 'src/entities/job.entity';
import { Post } from 'src/entities/post.entity';
import { Notification } from 'src/entities/notification.entity';
import { AuditLog } from 'src/entities/audit-log.entity';
import { WebhooksService } from 'src/webhooks/webhooks.service';
import { PostTarget } from 'src/entities/post-target.entity';
import { SocialAccount } from 'src/entities/social-account.entity';
import { AccountToken } from 'src/entities/account-token.entity';
import { ProviderFactory } from './providers/provider.factory';
import { Media } from 'src/entities/media.entity';
import { EventBusService } from 'src/event-bus/event-bus.service';

@Injectable()
export class PublisherService implements OnModuleInit {
  private readonly log = new Logger(PublisherService.name);
  private timer?: NodeJS.Timeout;
  private readonly maxAttempts = 5;

  constructor(
    private readonly em: EntityManager,
    private readonly webhooks: WebhooksService,
    private readonly events: EventBusService,
    private readonly providers: ProviderFactory,
  ) {}

  // Lifecycle: start background loop
  onModuleInit(): void {
    this.log.log('🚀 PublisherService initialized, starting scheduler loop...');

    this.timer = setInterval(() => {
      // wrap each tick in a MikroORM RequestContext
      void RequestContext.create(this.em, async () => {
        try {
          await this.tick();
        } catch (e) {
          const err = e as Error;
          this.log.error(
            `❌ tick() unhandled error: ${err.message}`,
            err.stack,
          );
        }
      });
    }, 5_000);
  }

  // Main tick: find pending jobs and process them
  private async tick(): Promise<void> {
    // Use a fork for isolation inside this RequestContext
    const em = this.em.fork();
    const now = new Date();

    const jobs = await em.find(
      Job,
      { status: 'pending', scheduledAt: { $lte: now } },
      {
        limit: 10,
        orderBy: { scheduledAt: 'ASC' },
      },
    );

    if (jobs.length === 0) return;

    this.log.log(`🔄 Processing ${jobs.length} job(s)...`);

    for (const job of jobs) {
      // Reload with this forked EM to ensure full entity graph belongs here
      const fullJob = await em.findOne(Job, job.id, {
        populate: ['post', 'target', 'target.socialAccount'],
      });

      if (!fullJob) {
        this.log.warn(`⚠️ Job ${job.id} not found on reload, skipping`);
        continue;
      }

      const post = fullJob.post as Post | undefined;
      const target = fullJob.target as PostTarget | undefined;

      if (!post) {
        await this.markFailed(em, fullJob, target ?? null, 'Post not found');
        continue;
      }

      if (!target) {
        await this.markFailed(
          em,
          fullJob,
          null,
          'PostTarget not found for job',
        );
        continue;
      }

      const account = target.socialAccount as SocialAccount | undefined;
      if (!account) {
        await this.markFailed(
          em,
          fullJob,
          target,
          'SocialAccount not found for target',
        );
        continue;
      }

      const mediaList = await em.find(Media, { post: post.id });

      await this.processJob(em, fullJob, post, target, account, mediaList);
    }
  }

  // Core job processing
  private async processJob(
    em: EntityManager,
    job: Job,
    post: Post,
    target: PostTarget,
    account: SocialAccount,
    mediaList: Media[],
  ): Promise<void> {
    try {
      this.log.log(`▶️ Starting Job ${job.id}, attempt ${job.attempt}`);

      // Move job to processing
      job.status = 'processing';
      await em.flush();

      // Fetch latest non-revoked access token
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
        await this.markFailed(
          em,
          job,
          target,
          'Access token not found for account',
        );
        return;
      }

      const accessToken = token.tokenEncrypted;

      // Build post text + media
      const text = [post.contentAr, post.contentEn].filter(Boolean).join('\n');

      const mediaUrls = mediaList.map((m) => m.url);
      if (!mediaUrls.length) {
        this.log.warn(
          `⚠️ Post ${post.id} has no media; will attempt text-only publish`,
        );
      }

      const publisher = this.providers.get(account.provider);

      // Mark target processing before any external call
      target.status = 'processing';
      await em.flush();

      // IMPORTANT: only call provider ONCE per job to avoid duplicate publishes
      // If job.attempt > 0, we assume an earlier attempt may already have hit the provider
      // so we do NOT re-publish externally.
      let result: {
        externalPostId?: string;
        externalUrl?: string;
        publishedAt?: Date;
      } | null = null;

      if (job.attempt === 0) {
        this.log.log(
          `🌐 Calling provider for job ${job.id} (first attempt only)`,
        );
        result = await publisher.publish({
          text,
          mediaUrls,
          accessToken,
          providerAccountId: account.providerAccountId,
        });
      } else {
        this.log.warn(
          `⏭️ Skipping external publish for job ${job.id} because attempt=${job.attempt} > 0 (avoid duplicate posts on provider)`,
        );
        result = null;
      }

      // Even if result is null (we skipped external publish), we can still mark
      // the job/target as success if we want. In your case, we’ll consider
      // *success* only when attempt===0 publish path succeeds.
      if (job.attempt === 0) {
        // Mark success
        if (result) {
          target.externalPostId = result.externalPostId;
          target.externalUrl = result.externalUrl;
          target.publishedAt = result.publishedAt ?? new Date();
        } else {
          // Extremely unlikely: publish returned nothing but no error thrown
          target.publishedAt = new Date();
        }
        target.status = 'success';
        target.updatedAt = new Date();

        job.status = 'success';
        job.executedAt = new Date();
        await this.events.emit('post.published', {
          postId: post.id,
          authorId: post.author.id,
          provider: account.provider,
          externalPostId: target.externalPostId ?? null,
          externalUrl: target.externalUrl ?? null,
          publishedAt: (target.publishedAt ?? new Date()).toISOString(),
        });
        await em.flush();
        await this.aggregatePostStatus(em, post);

        this.log.log(`✅ Job ${job.id} succeeded`);
      } else {
        // For attempts >0, we *only* update processing/failed state via handleJobError
        // or markFailed, so nothing special here.

        await this.events.emit('post.failed', {
          postId: post.id,
          authorId: post.author.id,
          error: job.lastError ?? 'unknown error',
          attempt: job.attempt,
        });
        this.log.log(
          `ℹ️ Job ${job.id} attempt > 0 finished internal processing (no external publish)`,
        );
      }
    } catch (e) {
      const err = e as Error;
      this.log.error(`❌ Job ${job.id} failed: ${err.message}`);
      await this.handleJobError(em, job, target, err.message);
    }
  }

  // Error handling + retry logic
  private async handleJobError(
    em: EntityManager,
    job: Job,
    target: PostTarget | null | undefined,
    errorMsg: string,
  ): Promise<void> {
    job.lastError = errorMsg;
    job.attempt += 1;

    if (target) {
      target.status = 'failed';
      target.lastError = errorMsg;
      target.attempt += 1;
    }

    // Max attempts reached → permanent failure
    if (job.attempt >= this.maxAttempts) {
      job.status = 'failed';
      await em.flush();

      const post = job.post as Post | undefined;
      if (post) {
        await this.aggregatePostStatus(em, post);
        await this.sendFailureNotification(em, post, errorMsg);
      }
      return;
    }

    // Retry: exponential backoff, BUT external publish will NOT be retried
    const delayMs = 1000 * 2 ** Math.min(job.attempt, 8);
    job.status = 'pending';
    job.scheduledAt = new Date(Date.now() + delayMs);

    await em.flush();

    const post = job.post as Post | undefined;
    if (post) {
      await this.aggregatePostStatus(em, post);
    }
  }

  // Mark job + target as failed (no retry)
  private async markFailed(
    em: EntityManager,
    job: Job,
    target: PostTarget | null | undefined,
    error: string,
  ): Promise<void> {
    job.status = 'failed';
    job.lastError = error;

    if (target) {
      target.status = 'failed';
      target.lastError = error;
    }

    await em.flush();

    const post = job.post as Post | undefined;
    if (post) {
      await this.aggregatePostStatus(em, post);
      await this.sendFailureNotification(em, post, error);
    }
  }

  // Notifications + audit logs
  private async sendFailureNotification(
    em: EntityManager,
    post: Post,
    error: string,
  ): Promise<void> {
    const notif = em.create(Notification, {
      user: post.author,
      type: 'post.failed',
      title: {
        en: 'Publish Failed',
        ar: 'فشل النشر',
        tr: 'Yayın Başarısız',
      },
      message: {
        en: `Failed to publish post: ${error}`,
        ar: `فشل نشر المنشور: ${error}`,
        tr: `Gönderi yayınlanamadı: ${error}`,
      },
      data: { postId: post.id, error },
      read: false,
      createdAt: new Date(),
    });

    const log = em.create(AuditLog, {
      user: post.author,
      action: 'post.publish_failed',
      entityType: 'post',
      entityId: String(post.id),
      details: { error },
      createdAt: new Date(),
    });

    em.persist([notif, log]);
    await em.flush();
  }

  // Post status aggregation across targets
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
