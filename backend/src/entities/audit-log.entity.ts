import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/core';
import { User } from './user.entity';
import type { WrapperType } from 'src/types/relation-wrapper';

@Entity()
export class AuditLog {
  @PrimaryKey()
  id!: number;

  @Index() // most queries filter by user
  @ManyToOne(() => User, { fieldName: 'userId', nullable: true })
  user?: WrapperType<User>;

  @Index() // frequently queried
  @Property()
  action!: string;
  // Examples:
  // 'auth.login'
  // 'auth.logout'
  // 'post.created'
  // 'post.published'
  // 'account.connected'
  // 'team.member_added'
  // 'settings.updated'

  @Index()
  @Property({ nullable: true })
  entityType?: string;
  // 'post', 'user', 'team', 'campaign', 'subscription', etc.

  @Index()
  @Property({ nullable: true })
  entityId?: string;
  // Store as string because IDs may include uuids in future

  @Property({ type: 'json', nullable: true })
  details?: Record<string, any>;

  // Security context
  @Property({ nullable: true })
  ipAddress?: string;

  @Property({ nullable: true })
  userAgent?: string;

  // Useful for linking related logs (optional)
  @Property({ nullable: true })
  correlationId?: string;

  @Index()
  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ nullable: true })
  metadata?: Record<string, any>;
}
