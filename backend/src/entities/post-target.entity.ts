import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/core';
import { Post } from './post.entity';
import { SocialAccount } from './social-account.entity';
import type { WrapperType } from 'src/types/relation-wrapper';

@Entity()
export class PostTarget {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Post, { fieldName: 'postId' })
  @Index({ name: 'post_target_post_idx' })
  post!: WrapperType<Post>;

  @ManyToOne(() => SocialAccount, { fieldName: 'socialAccountId' })
  @Index({ name: 'post_target_account_idx' })
  socialAccount!: WrapperType<SocialAccount>;

  @Property({
    default: 'pending',
  })
  status!: 'pending' | 'scheduled' | 'processing' | 'success' | 'failed';

  @Property({ default: 0 })
  attempt = 0;

  @Property({ nullable: true })
  lastError?: string;

  @Property({ nullable: true })
  externalPostId?: string;

  @Property({ nullable: true })
  externalUrl?: string;

  @Index()
  @Property({ nullable: true })
  scheduledAt?: Date;

  @Property({ nullable: true })
  publishedAt?: Date;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
