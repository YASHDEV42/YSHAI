import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/core';
import { Post } from './post.entity';
import { SocialAccount } from './social-account.entity';

@Entity()
export class PostAnalytics {
  @PrimaryKey()
  id!: number;

  @Index({ name: 'post_analytics_post_idx' })
  @ManyToOne(() => Post, { fieldName: 'postId' })
  post!: Post;

  // Which social account was this fetched from?
  @ManyToOne(() => SocialAccount, {
    fieldName: 'socialAccountId',
    nullable: true,
  })
  socialAccount?: SocialAccount;

  // Platform provider is needed because metrics differ per provider
  @Property()
  provider!: 'x' | 'instagram' | 'linkedin' | 'tiktok';

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

  @Index()
  @Property({ onCreate: () => new Date() })
  fetchedAt: Date = new Date();

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, any>;
}
