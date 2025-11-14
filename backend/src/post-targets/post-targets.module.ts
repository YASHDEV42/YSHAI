import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostTarget } from '../entities/post-target.entity';
import { Post } from '../entities/post.entity';
import { Job } from '../entities/job.entity';
import { PostTargetsService } from './post-targets.service';
import { PostTargetsController } from './post-targets.controller';

@Module({
  imports: [MikroOrmModule.forFeature([PostTarget, Post, Job])],
  controllers: [PostTargetsController],
  providers: [PostTargetsService],
})
export class PostTargetsModule {}
