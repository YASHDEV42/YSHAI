import { Entity, PrimaryKey, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { User } from './user.entity';

export enum NotificationType {
  POST_SCHEDULED = 'post_scheduled',
  PUBLISH_FAILED = 'publish_failed',
  AI_READY = 'ai_ready',
  APPROVED = 'approved',
}

export interface NotificationMessage {
  en: string;
  ar: string;
  tr: string;
}

@Entity()
export class Notification {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Enum(() => NotificationType)
  type!: NotificationType;

  @Property({ type: 'json' })
  title!: NotificationMessage;

  @Property({ type: 'json' })
  message!: NotificationMessage;

  @Property({ type: 'json', nullable: true })
  data?: Record<string, any>;

  @Property({ default: false })
  read = false;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ nullable: true })
  link?: string;
}
