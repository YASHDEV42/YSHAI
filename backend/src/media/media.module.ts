import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Media } from 'src/entities/media.entity';
import { Post } from 'src/entities/post.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Media, Post] })],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
