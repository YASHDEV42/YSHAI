import { Module } from '@nestjs/common';
import { EventBusService } from './event-bus.service';
import { WebhooksModule } from 'src/webhooks/webhooks.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Notification } from 'src/entities/notification.entity';
import { AuditLog } from 'src/entities/audit-log.entity';
import { User } from 'src/entities/user.entity';
import { WebhookEventsListener } from './listeners/webhook-events.listener';
import { NotificationEventsListener } from './listeners/notification-events.listener';

@Module({
  imports: [
    WebhooksModule,
    MikroOrmModule.forFeature([Notification, AuditLog, User]),
  ],
  providers: [
    EventBusService,
    // Auto-scalable list of listeners:
    WebhookEventsListener,
    NotificationEventsListener,
  ],
  exports: [EventBusService],
})
export class EventBusModule {}
