import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Tag } from '../entities/tag.entity';
import { Post } from '../entities/post.entity';
import { PostTag } from '../entities/post-tag.entity';
import { CreateTagDto } from './dto/tag.dto';

const logger = new Logger('tags');
@Injectable()
export class TagsService {
  constructor(private readonly em: EntityManager) {}

  private normalize(name: string): string {
    return name.toLowerCase().trim().replace(/\s+/g, '-');
  }

  /* ---------------------------------------------------------
   * LIST TAGS (user-specific + pagination)
   * --------------------------------------------------------- */
  async findAll(
    ownerId: number,
    page: number,
    limit: number,
    search?: string,
  ): Promise<Tag[]> {
    const offset = (page - 1) * limit;

    const where: Record<string, any> = { owner: ownerId };

    if (search) {
      const term = search.toLowerCase().trim();
      where.$or = [
        { name: { $ilike: `${term}%` }, owner: ownerId },
        { normalized: { $ilike: `${term}%` }, owner: ownerId },
      ];
    }
    logger.log(`Finding tags with criteria: ${JSON.stringify(where)}`);

    return await this.em.find(Tag, where, {
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
   * CREATE TAG (owner scoped)
   * --------------------------------------------------------- */
  async create(ownerId: number, dto: CreateTagDto): Promise<Tag> {
    const normalized = this.normalize(dto.name);

    // check existing tag for that user
    const existing = await this.em.findOne(Tag, {
      owner: ownerId,
      normalized,
    });

    if (existing) return existing;

    const tag = this.em.create(Tag, {
      owner: ownerId,
      name: dto.name.trim(),
      normalized,
      createdAt: new Date(),
    });

    await this.em.persistAndFlush(tag);
    return tag;
  }

  /* ---------------------------------------------------------
   * DELETE TAG (owner scoped)
   * --------------------------------------------------------- */
  async remove(id: number, ownerId: number): Promise<void> {
    const tag = await this.em.findOne(Tag, { id, owner: ownerId });
    if (!tag) throw new NotFoundException('Tag not found');
    await this.em.removeAndFlush(tag);
  }

  /* ---------------------------------------------------------
   * GET POST TAGS (owner enforced)
   * --------------------------------------------------------- */
  async getPostTags(postId: number, ownerId: number): Promise<Tag[]> {
    const post = await this.em.findOne(Post, { id: postId, author: ownerId });
    if (!post) throw new NotFoundException('Post not found');

    const postTags = await this.em.find(
      PostTag,
      { post: postId },
      { populate: ['tag'] },
    );

    return postTags.map((pt) => pt.tag);
  }

  /* ---------------------------------------------------------
   * SET POST TAGS (owner scoped)
   * --------------------------------------------------------- */
  async setPostTags(
    postId: number,
    ownerId: number,
    tagNames: string[],
  ): Promise<Tag[]> {
    return await this.em.transactional(async (em) => {
      const post = await em.findOne(Post, { id: postId, author: ownerId });
      if (!post) throw new NotFoundException('Post not found');

      const names = Array.from(
        new Set(tagNames.map((n) => n.trim()).filter((n) => n.length > 0)),
      );

      await em.nativeDelete(PostTag, { post: postId });

      if (names.length === 0) return [];

      const normalizedNames = names.map((n) => this.normalize(n));

      const existing = await em.find(Tag, {
        owner: ownerId,
        normalized: { $in: normalizedNames },
      });

      const map = new Map(existing.map((t) => [t.normalized, t]));
      const result: Tag[] = [];

      for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const normalized = normalizedNames[i];

        let tag = map.get(normalized);

        if (!tag) {
          tag = em.create(Tag, {
            owner: ownerId,
            name,
            normalized,
            createdAt: new Date(),
          });

          await em.persist(tag);
          map.set(normalized, tag);
        }

        const pt = em.create(PostTag, {
          post,
          tag,
          createdAt: new Date(),
        });

        await em.persist(pt);
        result.push(tag);
      }

      return result;
    });
  }
}
