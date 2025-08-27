import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { User } from './user.entity';

@Entity()
export class AuditLog {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Property()
  action!: string; // 'post.created', 'login.success', etc.

  @Property()
  entityType?: string; // 'post', 'user', 'team'

  @Property()
  entityId?: string;

  @Property({ type: 'json', nullable: true })
  details?: Record<string, any>;

  @Property({ onCreate: () => new Date() })
  timestamp = new Date();
}
