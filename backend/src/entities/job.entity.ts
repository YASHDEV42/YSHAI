import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Post } from './post.entity';

@Entity()
export class Job {
  @PrimaryKey()
  id!: string;

  @ManyToOne(() => Post)
  post!: Post;

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
