import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { User } from './user.entity';
import { AccountToken } from './account-token.entity';
import { PostTarget } from './post-target.entity';

@Entity()
export class SocialAccount {
  @PrimaryKey()
  id!: number;

  @Property()
  provider: 'x' | 'instagram' | 'linkedin' | 'tiktok' = 'x';

  @Property()
  providerAccountId!: string;

  @ManyToOne(() => User, { fieldName: 'userId' })
  user!: User;

  @Property({ nullable: true })
  username?: string;

  @Property()
  active = true;

  @Property({ nullable: true })
  followersCount?: number;

  @Property()
  connectedAt = new Date();

  @Property({ type: 'text', nullable: true })
  profilePictureUrl?: string;

  @Property({ nullable: true })
  pageId?: string;

  @Property({ nullable: true })
  pageName?: string;

  @Property({ nullable: true })
  disconnectedAt?: Date;

  @OneToMany(() => AccountToken, (token) => token.account)
  tokens = new Collection<AccountToken>(this);

  @OneToMany(() => PostTarget, (target) => target.socialAccount)
  postTargets = new Collection<PostTarget>(this);
}
