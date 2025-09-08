import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Job } from 'src/entities/job.entity';
import { Post } from 'src/entities/post.entity';
import { Notification } from 'src/entities/notification.entity';
import { AuditLog } from 'src/entities/audit-log.entity';
import { WebhooksService } from 'src/webhooks/webhooks.service';

@Injectable()
export class PublisherService implements OnModuleInit {
  private readonly log = new Logger(PublisherService.name);
  private timer?: NodeJS.Timeout;
  private readonly maxAttempts = 5;
  constructor(
    private readonly em: EntityManager,
    private readonly webhooks: WebhooksService,
  ) {}

  onModuleInit(): void {
    // Simple polling loop; in production use a queue/worker
    this.timer = setInterval(() => void this.tick(), 5_000);
  }

  private async tick(): Promise<void> {
    // Use a forked EM since this runs outside of request scope
    const em = this.em.fork();
    const now = new Date();
    const jobs = await em.find(
      Job,
      { status: 'pending', scheduledAt: { $lte: now } },
      { limit: 10, orderBy: { scheduledAt: 'ASC' } },
    );
    if (jobs.length === 0) return;

    for (const job of jobs) {
      try {
        job.status = 'processing';
        await em.flush();

        const post = await em.findOne(Post, { id: job.post.id });
        if (!post) {
          job.status = 'failed';
          job.lastError = 'Post not found';
          await em.flush();
          continue;
        }

        // Simulate publishing success
        post.status = 'published';
        post.publishedAt = new Date();
        job.status = 'success';
        job.executedAt = new Date();
        await em.flush();

        // fire webhook (post.published)
        await this.webhooks.emitInternal('post.published', {
          postId: post.id,
          status: post.status,
        });
      } catch (err) {
        this.log.error('Publish failed', err as Error);
        job.lastError = (err as Error).message;
        job.attempt += 1;

        if (job.attempt >= this.maxAttempts) {
          job.status = 'failed';
        } else {
          job.status = 'pending';
          // exponential backoff: now + 2^attempt * 1s
          const delayMs = 1000 * 2 ** Math.min(job.attempt, 8);
          job.scheduledAt = new Date(Date.now() + delayMs);
        }
        await em.flush();

        const post = await em.findOne(Post, { id: job.post.id });
        if (post && job.status === 'failed') {
          post.status = 'failed';
          await em.flush();
        }

        // simple notification + audit log (no team linkage yet)
        if (post) {
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
