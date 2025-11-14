import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  Index,
  Unique,
} from '@mikro-orm/core';

import { Post } from './post.entity';
import { SocialAccount } from './social-account.entity';
import { Membership } from './membership.entity';
import { Invoice } from './invoice.entity';
import { Notification } from './notification.entity';
import { AuditLog } from './audit-log.entity';
import { RefreshToken } from './refresh-token.entity';
import { PasswordResetToken } from './password-reset-token.entity';
import { WebhookSubscription } from './webhook-subscription.entity';
import { AIUsageLog } from './ai-usage-log.entity';
import { Campaign } from './campaign.entity';
import { Template } from './template.entity';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Unique()
  @Index()
  @Property()
  email!: string;

  @Property({ nullable: true, hidden: true })
  passwordHash?: string;

  @Property()
  name!: string;

  @Property({ default: 'user' })
  role: 'user' | 'admin' = 'user';

  @Property({ nullable: true })
  avatarUrl?: string;

  @Property({ nullable: true })
  timezone?: string;

  @Property({ default: false })
  isEmailVerified: boolean;

  // User preferences
  @Property({ nullable: true })
  language?: string;

  @Property({ nullable: true })
  locale?: string;

  @Property({ nullable: true })
  timeFormat?: '12h' | '24h';

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;

  // Relations
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

  @OneToMany(() => RefreshToken, (rt) => rt.user)
  refreshTokens = new Collection<RefreshToken>(this);

  @OneToMany(() => PasswordResetToken, (prt) => prt.user)
  passwordResetTokens = new Collection<PasswordResetToken>(this);

  @OneToMany(() => WebhookSubscription, (ws) => ws.user)
  webhookSubscriptions = new Collection<WebhookSubscription>(this);

  @OneToMany(() => AIUsageLog, (usage) => usage.user)
  aiUsageLogs = new Collection<AIUsageLog>(this);

  @OneToMany(() => Campaign, (campaign) => campaign.owner)
  campaigns = new Collection<Campaign>(this);

  @OneToMany(() => Template, (template) => template.owner)
  templates = new Collection<Template>(this);
}
