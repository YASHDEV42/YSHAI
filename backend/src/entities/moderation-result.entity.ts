import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Generation } from './generation.entity';
import { Post } from './post.entity';

@Entity()
export class ModerationResult {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Generation, { nullable: true })
  generation?: Generation;

  @ManyToOne(() => Post)
  post!: Post;

  @Property()
  provider: 'openai' | 'custom' = 'openai';

  @Property()
  verdict: 'allowed' | 'flagged' | 'blocked' = 'allowed';

  @Property({ type: 'json', nullable: true })
  details?: Record<string, any>;

  @Property({ onCreate: () => new Date() })
  checkedAt = new Date();
}
