import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Post } from './post.entity';
import { PostTarget } from './post-target.entity';

@Entity()
export class Job {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Post)
  post!: Post;

  // Link to the exact PostTarget (per social account) this job will publish
  @ManyToOne(() => PostTarget, { nullable: true })
  target?: PostTarget;

  @Property()
  provider: 'x' | 'instagram' | 'linkedin' | 'tiktok' = 'x';

  @Property({ default: 0 })
  attempt = 0;

  @Property()
  status: 'pending' | 'processing' | 'success' | 'failed' = 'pending';

  @Property({ nullable: true })
  lastError?: string;

  @Property({ onCreate: () => new Date() })
  scheduledAt = new Date();

  @Property({ nullable: true })
  executedAt?: Date;
}
