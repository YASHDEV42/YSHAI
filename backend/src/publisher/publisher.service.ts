import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EntityManager, RequestContext } from '@mikro-orm/core';
import { Job } from 'src/entities/job.entity';
import { Post } from 'src/entities/post.entity';
import { PostTarget } from 'src/entities/post-target.entity';
import { SocialAccount } from 'src/entities/social-account.entity';
import { AccountToken } from 'src/entities/account-token.entity';
import { Media } from 'src/entities/media.entity';
import { ProviderFactory } from './providers/provider.factory';
import { EventBusService } from 'src/event-bus/event-bus.service';

@Injectable()
export class PublisherService implements OnModuleInit {
  private readonly log = new Logger(PublisherService.name);
  private timer?: NodeJS.Timeout;
  private readonly maxAttempts = 5;

  constructor(
    private readonly em: EntityManager,
    private readonly events: EventBusService,
    private readonly providers: ProviderFactory,
  ) {}

  // Lifecycle: start background loop
  onModuleInit(): void {
    this.log.log('🚀 PublisherService initialized, starting scheduler loop...');

    this.timer = setInterval(() => {
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

  /**
   * Main tick: find pending jobs and process them.
   */
  private async tick(): Promise<void> {
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
        await this.markPermanentFailure(
          em,
          fullJob,
          target ?? null,
          'Post not found',
        );
        continue;
      }

      if (!target) {
        await this.markPermanentFailure(
          em,
          fullJob,
          null,
          'PostTarget not found for job',
        );
        continue;
      }

      const account = target.socialAccount as SocialAccount | undefined;
      if (!account) {
        await this.markPermanentFailure(
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

  /**
   * Handle one job: call provider, update DB, emit events.
   */
  private async processJob(
    em: EntityManager,
    job: Job,
    post: Post,
    target: PostTarget,
    account: SocialAccount,
    mediaList: Media[],
  ): Promise<void> {
    this.log.log(`▶️ Starting Job ${job.id}, attempt ${job.attempt}`);

    // Move job+target to processing
    job.status = 'processing';
    job.lastError = undefined;
    target.status = 'processing';
    target.lastError = undefined;
    target.updatedAt = new Date();
    await em.flush();

    try {
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
        await this.markPermanentFailure(
          em,
          job,
          target,
          'Access token not found for account',
        );
        return;
      }

      const accessToken = token.tokenEncrypted;

      // Build content
      const text = [post.contentAr, post.contentEn].filter(Boolean).join('\n');
      const media = mediaList
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((m) => ({
          url: m.url,
          kind: m.type, // 'image' | 'video'
        }));
      let kind: 'feed' | 'reel' | 'carousel' = 'feed';

      if (media.length > 1) {
        kind = 'carousel';
      } else if (media.length === 1 && media[0].kind === 'video') {
        // you can choose: treat single video as reel or feed
        kind = 'feed';
      }
      const publisher = this.providers.get(account.provider);

      // Call provider on every attempt (network errors can be transient).
      const result = await publisher.publish({
        text,
        media,
        kind,
        accessToken,
        providerAccountId: account.providerAccountId,
      });
      // Success path
      const now = new Date();
      target.externalPostId =
        result.externalPostId ?? target.externalPostId ?? null;
      target.externalUrl =
        result.externalUrl ?? target.externalUrl ?? undefined;
      target.publishedAt = result.publishedAt ?? target.publishedAt ?? now;
      target.status = 'success';
      target.updatedAt = now;

      job.status = 'success';
      job.executedAt = now;
      job.lastError = undefined;

      await em.flush();

      // Emit domain event (listeners will create notifications, webhooks, etc.)
      await this.events.emit('post.published', {
        postId: post.id,
        authorId: post.author.id,
        provider: account.provider,
        externalPostId: target.externalPostId ?? null,
        externalUrl: target.externalUrl ?? null,
        publishedAt: target.publishedAt.toISOString(),
      });

      await this.aggregatePostStatus(em, post);

      this.log.log(`✅ Job ${job.id} succeeded`);
    } catch (e) {
      const err = e as Error;
      this.log.error(`❌ Job ${job.id} failed: ${err.message}`);
      await this.handleJobError(em, job, target, err.message);
    }
  }

  /**
   * Error handling + retry logic.
   * We only emit post.failed when we give up (maxAttempts reached).
   */
  private async handleJobError(
    em: EntityManager,
    job: Job,
    target: PostTarget | null | undefined,
    errorMsg: string,
  ): Promise<void> {
    const now = new Date();

    job.lastError = errorMsg;
    job.attempt += 1;

    if (target) {
      target.status = 'failed';
      target.lastError = errorMsg;
      target.attempt += 1;
      target.updatedAt = now;
    }

    // Max attempts reached → permanent failure
    if (job.attempt >= this.maxAttempts) {
      await this.markPermanentFailure(em, job, target ?? null, errorMsg);
      return;
    }

    // Retry: exponential backoff, no notification yet
    const delayMs = 1000 * 2 ** Math.min(job.attempt, 8);
    job.status = 'pending';
    job.scheduledAt = new Date(Date.now() + delayMs);

    await em.flush();

    const post = job.post as Post | undefined;
    if (post) {
      await this.aggregatePostStatus(em, post);
    }

    this.log.warn(
      `🔁 Job ${job.id} scheduled for retry #${job.attempt} in ${delayMs}ms`,
    );
  }

  /**
   * Permanent failure: stop retrying and emit post.failed event.
   */
  private async markPermanentFailure(
    em: EntityManager,
    job: Job,
    target: PostTarget | null,
    error: string,
  ): Promise<void> {
    const now = new Date();

    job.status = 'failed';
    job.lastError = error;

    if (target) {
      target.status = 'failed';
      target.lastError = error;
      target.updatedAt = now;
    }

    await em.flush();

    const post = job.post as Post | undefined;
    if (post) {
      await this.aggregatePostStatus(em, post);

      await this.events.emit('post.failed', {
        postId: post.id,
        authorId: post.author.id,
        error,
        attempt: job.attempt,
      });
    }

    this.log.error(
      `⛔ Job ${job.id} permanently failed after ${job.attempt} attempt(s): ${error}`,
    );
  }

  /**
   * Aggregate status at Post level based on all its targets.
   * No webhooks/notifications here – that’s done via EventBus listeners.
   */
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
