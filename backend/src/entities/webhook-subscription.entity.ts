import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  Index,
  Unique,
} from '@mikro-orm/core';
import { User } from './user.entity';
import { WebhookDeliveryAttempt } from './webhook-delivery-attempt.entity';

@Entity()
@Unique({ properties: ['user', 'event', 'url'] })
export class WebhookSubscription {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User, { fieldName: 'userId' })
  user!: User;

  @Property()
  url!: string;

  @Index()
  @Property()
  event!:
    | 'post.published'
    | 'post.failed'
    | 'post.scheduled'
    | 'analytics.updated'
    | 'account.disconnected'
    | 'campaign.completed';

  @Property({ default: true })
  active = true;

  @Property({ type: 'text' })
  secretEncrypted!: string;

  @Property({ nullable: true })
  lastSuccessAt?: Date;

  @Property({ nullable: true })
  lastFailureAt?: Date;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @OneToMany(() => WebhookDeliveryAttempt, (attempt) => attempt.subscription)
  attempts = new Collection<WebhookDeliveryAttempt>(this);
}
