import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Job } from '../entities/job.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Job])],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
