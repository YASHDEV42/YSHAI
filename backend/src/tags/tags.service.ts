import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Tag } from '../entities/tag.entity';
import { Post } from '../entities/post.entity';
import { PostTag } from '../entities/post-tag.entity';
import { CreateTagDto } from './dto/tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly em: EntityManager) {}

  async findAll(search?: string): Promise<Tag[]> {
    const where: Record<string, any> = {};
    if (search) {
      const term = search.toLowerCase().trim();
      where.$or = [
        { name: { $ilike: `%${term}%` } },
        { normalized: { $ilike: `%${term}%` } },
      ];
    }
    return await this.em.find(Tag, where, { orderBy: { name: 'ASC' } });
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.em.findOne(Tag, { id });
    if (!tag) {
      throw new NotFoundException(`Tag with ID "${id}" not found`);
    }
    return tag;
  }

  async create(dto: CreateTagDto): Promise<Tag> {
    const normalized = dto.name.toLowerCase().trim().replace(/\s+/g, '-');
    const tag = this.em.create(Tag, {
      name: dto.name,
      normalized,
      createdAt: new Date(),
    });
    await this.em.persistAndFlush(tag);
    return tag;
  }

  async remove(id: number): Promise<void> {
    const tag = await this.em.findOne(Tag, { id });
    if (!tag) {
      throw new NotFoundException(`Tag with ID "${id}" not found`);
    }
    await this.em.removeAndFlush(tag);
  }

  async getPostTags(postId: number): Promise<Tag[]> {
    const post = await this.em.findOne(Post, { id: postId });
    if (!post) {
      throw new NotFoundException(`Post with ID "${postId}" not found`);
    }
    const postTags = await this.em.find(
      PostTag,
      { post: postId },
      { populate: ['tag'] },
    );
    return postTags.map((pt) => pt.tag);
  }

  async setPostTags(postId: number, tagNames: string[] = []): Promise<Tag[]> {
    const post = await this.em.findOne(Post, { id: postId });
    if (!post) {
      throw new NotFoundException(`Post with ID "${postId}" not found`);
    }

    const names = Array.from(
      new Set(tagNames.map((n) => n.trim()).filter((n) => n.length > 0)),
    );

    // Remove existing PostTag relations
    const existing = await this.em.find(PostTag, { post: postId });
    existing.forEach((pt) => this.em.remove(pt));

    if (names.length === 0) {
      await this.em.flush();
      return [];
    }

    // Find existing tags and create missing ones
    const normalizedNames = names.map((n) =>
      n.toLowerCase().replace(/\s+/g, '-'),
    );
    const existingTags = await this.em.find(Tag, {
      normalized: { $in: normalizedNames },
    });
    const existingByNormalized = new Map(
      existingTags.map((t) => [t.normalized, t]),
    );

    const resultTags: Tag[] = [];

    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const normalized = normalizedNames[i];
      let tag = existingByNormalized.get(normalized);
      if (!tag) {
        tag = this.em.create(Tag, { name, normalized, createdAt: new Date() });
        this.em.persist(tag);
        existingByNormalized.set(normalized, tag);
      }
      const postTag = this.em.create(PostTag, {
        post,
        tag,
        createdAt: new Date(),
      });
      this.em.persist(postTag);
      resultTags.push(tag);
    }

    await this.em.flush();
    return resultTags;
  }
}
