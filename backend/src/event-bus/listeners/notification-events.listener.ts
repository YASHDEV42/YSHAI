import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { EventBusService } from '../event-bus.service';
import { EventPayloadMap } from '../events.types';
import { Notification } from 'src/entities/notification.entity';
import { AuditLog } from 'src/entities/audit-log.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class NotificationEventsListener {
  private readonly log = new Logger(NotificationEventsListener.name);

  constructor(
    private readonly events: EventBusService,
    private readonly em: EntityManager,
  ) {
    this.register();
  }

  private register() {
    this.events.on('post.published', (p) => this.onPostPublished(p));
    this.events.on('post.failed', (p) => this.onPostFailed(p));
  }

  private async onPostPublished(payload: EventPayloadMap['post.published']) {
    const author = this.em.getReference(User, payload.authorId);
    const now = new Date();

    const notification = this.em.create(Notification, {
      user: author,
      type: 'post.published',
      read: false,
      createdAt: now,
      title: {
        en: 'Post Published',
        ar: 'تم نشر المنشور',
      },
      message: {
        en: `Your post was successfully published on ${payload.provider}`,
        ar: `تم نشر منشورك بنجاح على ${payload.provider}`,
      },
      data: payload,
    });

    const log = this.em.create(AuditLog, {
      user: author,
      action: 'post.published',
      entityId: String(payload.postId),
      entityType: 'post',
      details: payload,
      createdAt: now,
    });

    await this.em.persistAndFlush([notification, log]);

    this.log.log(`🔔 Notification → Post ${payload.postId} published`);
  }

  private async onPostFailed(payload: EventPayloadMap['post.failed']) {
    const author = this.em.getReference(User, payload.authorId);
    const now = new Date();

    const notification = this.em.create(Notification, {
      user: author,
      type: 'post.failed',
      read: false,
      createdAt: now,
      title: {
        en: 'Post Failed',
        ar: 'فشل نشر المنشور',
      },
      message: {
        en: `Your post failed to publish: ${payload.error}`,
        ar: `فشل نشر منشورك: ${payload.error}`,
      },
      data: payload,
    });

    const log = this.em.create(AuditLog, {
      user: author,
      action: 'post.failed',
      entityId: String(payload.postId),
      entityType: 'post',
      details: payload,
      createdAt: now,
    });

    await this.em.persistAndFlush([notification, log]);

    this.log.warn(`🔔 Notification → Post ${payload.postId} FAILED`);
  }
}
