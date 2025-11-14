import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { PostTarget } from '../entities/post-target.entity';
import { Post } from '../entities/post.entity';
import { Job } from '../entities/job.entity';
import { PostTargetResponseDto } from './dto/post-target.dto';

@Injectable()
export class PostTargetsService {
  constructor(private readonly em: EntityManager) {}

  private toDto(target: PostTarget): PostTargetResponseDto {
    return {
      id: target.id,
      postId: target.post.id,
      socialAccountId: target.socialAccount.id,
      provider: target.socialAccount.provider,
      status: target.status,
      attempt: target.attempt,
      lastError: target.lastError ?? null,
      externalPostId: target.externalPostId ?? null,
      externalUrl: target.externalUrl ?? null,
      scheduledAt: target.scheduledAt ? target.scheduledAt.toISOString() : null,
      publishedAt: target.publishedAt ? target.publishedAt.toISOString() : null,
      createdAt: target.createdAt.toISOString(),
      updatedAt: target.updatedAt.toISOString(),
    };
  }

  async findByPost(postId: number): Promise<PostTargetResponseDto[]> {
    const post = await this.em.findOne(Post, { id: postId });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const targets = await this.em.find(
      PostTarget,
      { post: postId },
      { populate: ['socialAccount'] },
    );
    return targets.map((t) => this.toDto(t));
  }

  async findOne(id: number): Promise<PostTargetResponseDto> {
    const target = await this.em.findOne(
      PostTarget,
      { id },
      { populate: ['post', 'socialAccount'] },
    );
    if (!target) {
      throw new NotFoundException('Post target not found');
    }
    return this.toDto(target);
  }

  async retry(id: number): Promise<PostTargetResponseDto> {
    const target = await this.em.findOne(
      PostTarget,
      { id },
      { populate: ['post', 'socialAccount'] },
    );
    if (!target) {
      throw new NotFoundException('Post target not found');
    }
    if (target.status !== 'failed') {
      throw new BadRequestException('Only failed targets can be retried');
    }

    target.status = 'pending';
    target.attempt = 0;
    target.lastError = undefined;

    // Create a new job for this target
    const now = new Date();
    const job = this.em.create(Job, {
      post: target.post,
      target,
      provider: target.socialAccount.provider,
      status: 'pending',
      attempt: 0,
      scheduledAt: now,
      createdAt: now,
      updatedAt: now,
    });
    this.em.persist(job);

    await this.em.flush();
    return this.toDto(target);
  }

  async cancel(id: number): Promise<PostTargetResponseDto> {
    const target = await this.em.findOne(PostTarget, { id });
    if (!target) {
      throw new NotFoundException('Post target not found');
    }
    if (!['pending', 'scheduled', 'processing'].includes(target.status)) {
      throw new BadRequestException(
        'Only pending, scheduled, or processing targets can be cancelled',
      );
    }

    target.status = 'failed';
    target.lastError = target.lastError ?? 'Cancelled by user';

    await this.em.flush();
    return this.toDto(target);
  }
}
