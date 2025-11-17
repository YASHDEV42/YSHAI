import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../event-bus.service';
import { EventPayloadMap } from '../events.types';

@Injectable()
export class ModerationEventsListener {
  private readonly log = new Logger(ModerationEventsListener.name);

  constructor(private readonly events: EventBusService) {
    this.register();
  }

  private register() {
    this.events.on('post.moderation.completed', (p) =>
      this.onModerationCompleted(p),
    );
  }

  private onModerationCompleted(
    payload: EventPayloadMap['post.moderation.completed'],
  ) {
    this.log.log(
      `🧩 Moderation complete → Post ${payload.postId} verdict = ${payload.verdict}`,
    );
  }
}
