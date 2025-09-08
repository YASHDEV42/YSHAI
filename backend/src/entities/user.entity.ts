import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { Post } from './post.entity';
import { SocialAccount } from './social-account.entity';
import { Membership } from './membership.entity';
import { Invoice } from './invoice.entity';
import { Notification } from './notification.entity';
import { AuditLog } from './audit-log.entity';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  email!: string;

  @Property({ nullable: true, hidden: true })
  passwordHash?: string;

  @Property()
  name!: string;

  @Property({ default: 'user' })
  role: 'user' | 'admin' = 'user';

  @Property({ nullable: true })
  timezone?: string;

  // Optional user preference fields
  @Property({ nullable: true })
  language?: string;

  @Property({ nullable: true })
  locale?: string;

  @Property({ nullable: true })
  timeFormat?: '12h' | '24h';

  @Property({ nullable: true })
  resetToken?: string;

  @Property({ nullable: true })
  resetTokenExpiresAt?: Date;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ onUpdate: () => new Date() })
  updatedAt!: Date;

  @Property({ nullable: true })
  deletedAt?: Date;

  @OneToMany(() => Post, (post) => post.author)
  posts = new Collection<Post>(this);

  @OneToMany(() => SocialAccount, (account) => account.user)
  socialAccounts = new Collection<SocialAccount>(this);

  @OneToMany(() => Membership, (membership) => membership.user)
  memberships = new Collection<Membership>(this);

  @OneToMany(() => Invoice, (invoice) => invoice.user)
  invoices = new Collection<Invoice>(this);

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications = new Collection<Notification>(this);

  @OneToMany(() => AuditLog, (log) => log.user)
  auditLogs = new Collection<AuditLog>(this);
}
