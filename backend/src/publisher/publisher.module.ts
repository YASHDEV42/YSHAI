import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PublisherService } from './publisher.service';
import { Post } from 'src/entities/post.entity';
import { Job } from 'src/entities/job.entity';
import { PostTarget } from 'src/entities/post-target.entity';
import { ProviderFactory } from './providers/provider.factory';
import { WebhooksModule } from 'src/webhooks/webhooks.module';

@Module({
  imports: [MikroOrmModule.forFeature([Post, Job, PostTarget]), WebhooksModule],
  providers: [PublisherService, ProviderFactory],
})
export class PublisherModule {}
