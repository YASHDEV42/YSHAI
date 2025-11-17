import { Module } from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { ModerationController } from './moderation.controller';
import { EventBusModule } from 'src/event-bus/event-bus.module';

@Module({
  providers: [ModerationService],
  imports: [EventBusModule],
  controllers: [ModerationController],
  exports: [ModerationService],
})
export class ModerationModule {}
