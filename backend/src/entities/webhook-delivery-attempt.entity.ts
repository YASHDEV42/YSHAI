import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { WebhookSubscription } from './webhook-subscription.entity';

@Entity()
export class WebhookDeliveryAttempt {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => WebhookSubscription)
  subscription!: WebhookSubscription;

  @Property()
  url!: string;

  @Property()
  event!: WebhookSubscription['event'];

  @Property()
  attemptNumber!: number;

  @Property()
  status!: 'delivered' | 'failed';

  @Property({ nullable: true })
  responseCode?: number;

  @Property({ nullable: true })
  errorMessage?: string;

  @Property({ nullable: true })
  durationMs?: number;

  @Property()
  payloadHash!: string;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();
}
