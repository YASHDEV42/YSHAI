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
import { Post } from './post.entity';

@Entity()
export class SocialAccount {
  @PrimaryKey()
  id!: string;

  @Property()
  provider: 'x' | 'instagram' | 'linkedin' | 'tiktok' = 'x';

  @Property()
  providerAccountId!: string;

  @ManyToOne(() => User)
  user!: User;

  @Property()
  active = true;

  @Property({ onCreate: () => new Date() })
  connectedAt = new Date();

  @Property({ nullable: true })
  disconnectedAt?: Date;

  @OneToMany(() => AccountToken, (token) => token.account)
  tokens = new Collection<AccountToken>(this);

  @OneToMany(() => Post, (post) => post.socialAccount)
  posts = new Collection<Post>(this);
}
