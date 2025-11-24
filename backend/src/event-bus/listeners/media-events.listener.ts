import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../event-bus.service';
import { EventPayloadMap } from '../events.types';

@Injectable()
export class MediaEventsListener {
  private readonly log = new Logger(MediaEventsListener.name);

  constructor(private readonly events: EventBusService) {
    this.register();
  }

  private register() {
    this.events.on('media.uploaded', (p) => this.onMediaUploaded(p));
    this.events.on('media.processing_completed', (p) =>
      this.onMediaProcessed(p),
    );
  }

  private onMediaUploaded(payload: EventPayloadMap['media.uploaded']) {
    this.log.log(`📤 Media uploaded → ${payload.mediaId}`);
  }

  private onMediaProcessed(
    payload: EventPayloadMap['media.processing_completed'],
  ) {
    this.log.log(`🎬 Media processed → ${payload.mediaId}`);
  }
}
