import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../event-bus.service';
import { EventName, EventPayloadMap } from '../events.types';

@Injectable()
export class PostEventsListener {
  private readonly log = new Logger(PostEventsListener.name);

  constructor(private readonly events: EventBusService) {
    this.register();
  }

  private register() {
    this.events.on('post.created', (p) => this.onPostCreated(p));
    this.events.on('post.updated', (p) => this.onPostUpdated(p));
    this.events.on('post.deleted', (p) => this.onPostDeleted(p));
    this.events.on('post.scheduled', (p) => this.onPostScheduled(p));
  }

  private onPostCreated(payload: EventPayloadMap['post.created']) {
    this.log.log(`🟢 Post created → ${payload.postId}`);
  }

  private onPostUpdated(payload: EventPayloadMap['post.updated']) {
    this.log.log(
      `🟡 Post updated → ${payload.postId} (fields: ${payload.updatedFields.join(', ')})`,
    );
  }

  private onPostDeleted(payload: EventPayloadMap['post.deleted']) {
    this.log.warn(`🔴 Post deleted → ${payload.postId}`);
  }

  private onPostScheduled(payload: EventPayloadMap['post.scheduled']) {
    this.log.log(
      `📅 Post scheduled → ${payload.postId} at ${payload.scheduledAt}`,
    );
  }
}
