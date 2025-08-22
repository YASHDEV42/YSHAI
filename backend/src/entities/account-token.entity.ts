import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { SocialAccount } from './social-account.entity';

@Entity()
export class AccountToken {
  @PrimaryKey()
  id!: string;

  @ManyToOne(() => SocialAccount)
  account!: SocialAccount;

  @Property()
  tokenType: 'access' | 'refresh' = 'access';

  @Property()
  tokenEncrypted!: string;

  @Property({ nullable: true })
  expiresAt?: Date;

  @Property({ default: false })
  revoked = false;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();
}
