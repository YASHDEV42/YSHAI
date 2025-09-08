import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PublisherService } from './publisher.service';
import { Post } from 'src/entities/post.entity';
import { Job } from 'src/entities/job.entity';
import { WebhooksModule } from 'src/webhooks/webhooks.module';

@Module({
  imports: [MikroOrmModule.forFeature([Post, Job]), WebhooksModule],
  providers: [PublisherService],
})
export class PublisherModule {}
