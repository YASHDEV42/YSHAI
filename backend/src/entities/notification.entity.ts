import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/core';
import { User } from './user.entity';

@Entity()
export class Notification {
  @PrimaryKey()
  id!: number;

  @Index()
  @ManyToOne(() => User, { fieldName: 'userId' })
  user!: User;

  @Property()
  type!:
    | 'post.published'
    | 'post.failed'
    | 'analytics.updated'
    | 'account.disconnected'
    | 'subscription.ending'
    | 'system';

  @Property({ type: 'json' })
  title!: Record<string, string>; // { en: "...", ar: "..." }

  @Property({ type: 'json' })
  message!: Record<string, string>;

  // Custom data for handling complex UI actions
  @Property({ type: 'json', nullable: true })
  data?: Record<string, any>;

  @Property({ nullable: true })
  link?: string; // deep link / dashboard route

  @Property({ default: false })
  read = false;

  @Index()
  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ nullable: true })
  readAt?: Date;

  @Property({ nullable: true })
  deletedAt?: Date;

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, any>;
}
