import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Media } from 'src/entities/media.entity';
import { Post } from 'src/entities/post.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Media, Post])],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
