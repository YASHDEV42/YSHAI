import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { WebhookSubscription } from 'src/entities/webhook-subscription.entity';
import { WebhookDeliveryAttempt } from 'src/entities/webhook-delivery-attempt.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [WebhookSubscription, WebhookDeliveryAttempt],
    }),
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService],
  exports: [WebhooksService],
})
export class WebhooksModule {}
