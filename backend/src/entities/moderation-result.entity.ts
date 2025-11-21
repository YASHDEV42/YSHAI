import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/core';
import { Post } from './post.entity';
import { Generation } from './generation.entity';
import type { WrapperType } from 'src/types/relation-wrapper';

@Entity()
export class ModerationResult {
  @PrimaryKey()
  id!: number;

  @Index()
  @ManyToOne(() => Generation, {
    fieldName: 'generationId',
    nullable: true,
  })
  generation?: WrapperType<Generation>;

  @Index()
  @ManyToOne(() => Post, {
    fieldName: 'postId',
    nullable: true,
  })
  post?: WrapperType<Post>;

  @Property()
  provider!: 'openai' | 'meta' | 'tiktok' | 'internal';

  @Property()
  verdict!: 'allowed' | 'flagged' | 'blocked';

  @Property({ type: 'json', nullable: true })
  details?: Record<string, any>; // raw moderation API output

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();
}
