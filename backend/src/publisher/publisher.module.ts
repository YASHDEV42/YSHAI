import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PublisherService } from './publisher.service';
import { Post } from 'src/entities/post.entity';
import { Job } from 'src/entities/job.entity';
import { PostTarget } from 'src/entities/post-target.entity';
import { ProviderFactory } from './providers/provider.factory';
import { WebhooksModule } from 'src/webhooks/webhooks.module';
import { MediaModule } from 'src/media/media.module';
import { MetaModule } from 'src/meta/meta.module';
import { EventBusModule } from 'src/event-bus/event-bus.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Post, Job, PostTarget]),
    WebhooksModule,
    MediaModule,
    MetaModule,
    EventBusModule,
  ],
  providers: [PublisherService, ProviderFactory],
  exports: [PublisherService],
})
export class PublisherModule {}
