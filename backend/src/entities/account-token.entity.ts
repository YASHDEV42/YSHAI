import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { SocialAccount } from './social-account.entity';

@Entity()
export class AccountToken {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => SocialAccount)
  account!: SocialAccount;

  @Property()
  tokenType: 'access' | 'refresh' = 'access';

  @Property({ type: 'text' })
  tokenEncrypted!: string;

  @Property({ nullable: true })
  expiresAt?: Date;

  @Property({ default: false })
  revoked = false;

  @Property({ nullable: true })
  username?: string;

  @Property({ nullable: true })
  followersCount?: number;

  @Property({ nullable: true })
  profilePictureUrl?: string;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();
}
