import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/core';
import { WebhookSubscription } from './webhook-subscription.entity';
import type { WrapperType } from 'src/types/relation-wrapper';

@Entity()
export class WebhookDeliveryAttempt {
  @PrimaryKey()
  id!: number;

  @Index()
  @ManyToOne(() => WebhookSubscription, { fieldName: 'subscriptionId' })
  subscription!: WrapperType<WebhookSubscription>;

  // We keep this only if you want to log the exact URL at delivery time.
  @Property()
  url!: string;

  @Index()
  @Property()
  event!: WebhookSubscription['event'];

  @Property()
  attemptNumber!: number;

  @Index()
  @Property()
  status!: 'delivered' | 'failed';

  @Property({ nullable: true })
  responseCode?: number;

  @Property({ nullable: true, type: 'text' })
  responseBody?: string;

  @Property({ nullable: true })
  errorMessage?: string;

  @Property({ nullable: true })
  durationMs?: number;

  @Property()
  payloadHash!: string;

  @Index()
  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  // More accurate timestamp name than createdAt
  @Property({ onCreate: () => new Date() })
  attemptedAt = new Date();
}
