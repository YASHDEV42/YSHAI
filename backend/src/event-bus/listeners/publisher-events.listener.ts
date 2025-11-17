import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../event-bus.service';
import { EventPayloadMap } from '../events.types';

@Injectable()
export class PublisherEventsListener {
  private readonly log = new Logger(PublisherEventsListener.name);

  constructor(private readonly events: EventBusService) {
    this.register();
  }

  private register() {
    this.events.on('post.published', (p) => this.onPostPublished(p));
    this.events.on('post.failed', (p) => this.onPostFailed(p));
  }

  private onPostPublished(payload: EventPayloadMap['post.published']) {
    this.log.log(
      `✅ Published → Post ${payload.postId} via ${payload.provider} (url: ${payload.externalUrl})`,
    );
  }

  private onPostFailed(payload: EventPayloadMap['post.failed']) {
    this.log.error(
      `❌ Publish failed → Post ${payload.postId}. Error: ${payload.error} (attempt ${payload.attempt})`,
    );
  }
}
