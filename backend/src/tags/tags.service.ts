import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Tag } from '../entities/tag.entity';
import { Post } from '../entities/post.entity';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';

@Injectable()
export class TagsService {
  private readonly logger = new Logger('TagsService');

  constructor(private readonly em: EntityManager) {}

  private normalize(name: string): string {
    return name.toLowerCase().trim().replace(/\s+/g, '-');
  }

  /* ---------------------------------------------------------
   * LIST TAGS (owner scoped + pagination + search)
   * --------------------------------------------------------- */
  async findAll(
    ownerId: number,
    page: number,
    limit: number,
    search?: string,
  ): Promise<Tag[]> {
    const offset = (page - 1) * limit;

    const where: any = { owner: ownerId };

    if (search) {
      const term = search.toLowerCase().trim();
      where.$or = [
        { name: { $ilike: `${term}%` }, owner: ownerId },
        { normalized: { $ilike: `${term}%` }, owner: ownerId },
      ];
    }

    return this.em.find(Tag, where, {
      limit,
      offset,
      orderBy: { name: 'ASC' },
    });
  }

  /* ---------------------------------------------------------
   * FIND ONE TAG (owner scoped)
   * --------------------------------------------------------- */
  async findOne(id: number, ownerId: number): Promise<Tag> {
    const tag = await this.em.findOne(Tag, { id, owner: ownerId });
    if (!tag) throw new NotFoundException('Tag not found');
    return tag;
  }

  /* ---------------------------------------------------------
   * CREATE TAG (safe + idempotent)
   * --------------------------------------------------------- */
  async create(ownerId: number, dto: CreateTagDto): Promise<Tag> {
    const normalized = this.normalize(dto.name);

    // Check if tag exists already
    const existing = await this.em.findOne(Tag, { owner: ownerId, normalized });
    if (existing) return existing;

    const tag = this.em.create(Tag, {
      owner: ownerId,
      name: dto.name.trim(),
      normalized,
      createdAt: new Date(),
      metadata: dto.metadata ?? null,
    });

    await this.em.persistAndFlush(tag);
    return tag;
  }

  /* ---------------------------------------------------------
   * UPDATE TAG (name + metadata)
   * --------------------------------------------------------- */
  async update(id: number, ownerId: number, dto: UpdateTagDto): Promise<Tag> {
    const tag = await this.em.findOne(Tag, { id, owner: ownerId });
    if (!tag) throw new NotFoundException('Tag not found');

    // Rename
    if (dto.name) {
      tag.name = dto.name.trim();
      tag.normalized = this.normalize(dto.name);
    }

    // Update metadata
    if (dto.metadata !== undefined) {
      tag.metadata = dto.metadata;
    }

    await this.em.flush();
    return tag;
  }

  /* ---------------------------------------------------------
   * DELETE TAG
   * --------------------------------------------------------- */
  async remove(id: number, ownerId: number): Promise<void> {
    const tag = await this.em.findOne(Tag, { id, owner: ownerId });
    if (!tag) throw new NotFoundException('Tag not found');
    await this.em.removeAndFlush(tag);
  }

  /* ---------------------------------------------------------
   * GET OR CREATE TAG (backend mirror of helper)
   * --------------------------------------------------------- */
  async getOrCreate(ownerId: number, name: string): Promise<Tag> {
    const normalized = this.normalize(name);

    // find existing
    let tag = await this.em.findOne(Tag, {
      owner: ownerId,
      normalized,
    });

    if (tag) return tag;

    // create new
    tag = this.em.create(Tag, {
      owner: ownerId,
      name,
      normalized,
      createdAt: new Date(),
    });

    await this.em.persistAndFlush(tag);
    return tag;
  }

  /* ---------------------------------------------------------
   * GET TAGS FOR POST (simple & clean)
   * --------------------------------------------------------- */
  async getPostTags(postId: number, ownerId: number): Promise<Tag[]> {
    const post = await this.em.findOne(
      Post,
      { id: postId, author: ownerId },
      {
        populate: ['tags'],
      },
    );
    if (!post) throw new NotFoundException('Post not found');

    return post.tags.getItems();
  }

  /* ---------------------------------------------------------
   * SET TAGS ON POST  (many-to-many, no manual pivot)
   * --------------------------------------------------------- */
  async setPostTags(
    postId: number,
    ownerId: number,
    tagIds: number[],
  ): Promise<Tag[]> {
    const post = await this.em.findOne(
      Post,
      { id: postId, author: ownerId },
      {
        populate: ['tags'],
      },
    );
    if (!post) throw new NotFoundException('Post not found');

    const uniqueIds = [...new Set(tagIds)];

    // Load tags
    const tags = await this.em.find(Tag, {
      id: { $in: uniqueIds },
      owner: ownerId,
    });

    if (tags.length !== uniqueIds.length) {
      throw new BadRequestException('Invalid or unauthorized tags');
    }

    // Set tags (MikroORM handles pivot table automatically)
    post.tags.set(tags);

    await this.em.flush();
    return tags;
  }
}
