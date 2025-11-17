import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../event-bus.service';
import { WebhooksService } from 'src/webhooks/webhooks.service';
import { EventPayloadMap } from '../events.types';

@Injectable()
export class WebhookEventsListener {
  private readonly log = new Logger(WebhookEventsListener.name);

  constructor(
    private readonly events: EventBusService,
    private readonly webhooks: WebhooksService,
  ) {
    this.register();
  }

  private register() {
    this.events.on('post.published', (p) => this.onPostPublished(p));
    this.events.on('post.failed', (p) => this.onPostFailed(p));
    this.events.on('post.moderation.completed', (p) =>
      this.onModerationCompleted(p),
    );
  }

  private async onPostPublished(payload: EventPayloadMap['post.published']) {
    this.log.log(`🌐 Webhook dispatch → post.published`);
    await this.webhooks.emitInternal('post.published', payload);
  }

  private async onPostFailed(payload: EventPayloadMap['post.failed']) {
    this.log.log(`🌐 Webhook dispatch → post.failed`);
    await this.webhooks.emitInternal('post.failed', payload);
  }

  private async onModerationCompleted(
    payload: EventPayloadMap['post.moderation.completed'],
  ) {
    this.log.log(`🌐 Webhook dispatch → post.moderation.completed`);
    await this.webhooks.emitInternal('post.moderation.completed', payload);
  }
}
