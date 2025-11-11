import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Media } from 'src/entities/media.entity';
import { Post } from 'src/entities/post.entity';
import * as cloudinary from 'cloudinary';
import { MediaResponseDto } from './dto/media-response.dto';
import { Readable } from 'node:stream';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(private readonly em: EntityManager) {}

  async upload(
    file: { path?: string; buffer?: Buffer },
    postId?: number,
  ): Promise<MediaResponseDto> {
    this.logger.log('uploading media file to Cloudinary');
    let post: Post | null = null;
    if (postId !== undefined) {
      post = await this.em.findOne(Post, { id: postId });
      if (!post) {
        throw new NotFoundException(`Post with ID ${postId} not found`);
      }
    }
    try {
      if (!(file?.path || file?.buffer)) {
        throw new BadRequestException('No valid file provided for upload');
      }
      const uploadResult = await this.uploadToCloudinary(file);

      const media = this.em.create(Media, {
        url: uploadResult.secure_url,
        type: uploadResult.resource_type === 'video' ? 'video' : 'image',
        ...(post ? { post } : {}),
        orderIndex: 0,
        createdAt: new Date(),
      });

      await this.em.persistAndFlush(media);

      return {
        id: media.id,
        url: media.url,
        type: media.type,
        orderIndex: media.orderIndex,
        createdAt: media.createdAt,
        postId: media.post?.id,
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Cloudinary upload failed: ${msg}`);
      throw new Error('Failed to upload media to Cloudinary');
    }
  }

  private async uploadToCloudinary(file: {
    path?: string;
    buffer?: Buffer;
  }): Promise<cloudinary.UploadApiResponse> {
    const options = { resource_type: 'auto', folder: 'yshai/media' } as const;
    if (file.path) {
      return cloudinary.v2.uploader.upload(file.path, options);
    }
    // Buffer path: stream upload
    return new Promise<cloudinary.UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        options,
        (err, result) => {
          if (err) {
            const message = err?.message ?? 'Cloudinary upload failed';
            return reject(new Error(message));
          }
          if (!result) {
            return reject(new Error('Empty Cloudinary response'));
          }
          return resolve(result);
        },
      );
      try {
        Readable.from(file.buffer as Buffer).pipe(uploadStream);
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        reject(new Error(message));
      }
    });
  }

  async findAll(): Promise<MediaResponseDto[]> {
    const mediaList = await this.em.find(
      Media,
      {},
      { populate: ['post'], orderBy: { createdAt: 'DESC' } },
    );

    return mediaList.map((m) => ({
      id: m.id,
      url: m.url,
      type: m.type,
      orderIndex: m.orderIndex,
      createdAt: m.createdAt,
      postId: m.post?.id,
    }));
  }

  async remove(id: number): Promise<void> {
    const media = await this.em.findOne(Media, { id }, { populate: ['post'] });
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    try {
      const publicId = this.extractPublicId(media.url);
      await cloudinary.v2.uploader.destroy(publicId);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Failed to delete media from Cloudinary: ${msg}`);
    }

    await this.em.removeAndFlush(media);
  }

  private extractPublicId(url: string): string {

    const match = url.match(/\/upload\/(.*)$/);
    const afterUpload = match ? match[1] : url;
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    const withoutQuery = withoutVersion.split('?')[0];
    return withoutQuery.replace(/\.[^/.]+$/, '');
  }
}
