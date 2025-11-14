import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/core';
import { Post } from './post.entity';
import { PostTarget } from './post-target.entity';

@Entity()
export class Job {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Post, { fieldName: 'postId' })
  post!: Post;

  @ManyToOne(() => PostTarget, { nullable: true, fieldName: 'postTargetId' })
  target?: PostTarget;

  @Property()
  provider!: 'x' | 'instagram' | 'linkedin' | 'tiktok';

  @Property({ default: 0 })
  attempt = 0;

  @Property()
  status!: 'pending' | 'processing' | 'success' | 'failed';

  @Property({ nullable: true })
  lastError?: string;

  @Index() // IMPORTANT for scheduler worker performance
  @Property({ onCreate: () => new Date() })
  scheduledAt = new Date();

  @Property({ nullable: true })
  executedAt?: Date;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ nullable: true, type: 'json' })
  metadata?: Record<string, any>;
}
