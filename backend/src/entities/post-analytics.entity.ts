import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/core';
import { Post } from './post.entity';

@Entity()
export class PostAnalytics {
  @PrimaryKey()
  id!: number;

  @Index({ name: 'post_analytics_post_time_idx' })
  @ManyToOne(() => Post)
  post!: Post;

  @Property({ default: 0 })
  impressions = 0;

  @Property({ default: 0 })
  clicks = 0;

  @Property({ default: 0 })
  likes = 0;

  @Property({ default: 0 })
  comments = 0;

  @Property({ default: 0 })
  shares = 0;

  @Property()
  fetchedAt!: Date;
}
