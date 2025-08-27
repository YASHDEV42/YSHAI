import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  ManyToOne,
} from '@mikro-orm/core';
import { User } from './user.entity';
import { Subscription } from './subscription.entity';

@Entity()
export class Invoice {
  @PrimaryKey()
  id!: number;

  @Property()
  amount!: number;

  @Property()
  currency: 'SAR' | 'USD' | 'EUR' = 'SAR';

  @Property()
  status: 'paid' | 'unpaid' | 'refunded' | 'failed' = 'unpaid';

  @Property()
  paymentGatewayId?: string;

  @Property()
  paymentMethod?: string;

  @Property({ onCreate: () => new Date() })
  issuedAt = new Date();

  @Property({ nullable: true })
  paidAt?: Date;

  @Property({ nullable: true })
  downloadedAt?: Date;

  @Property({ nullable: true })
  pdfUrl?: string;

  @Property({ type: 'json', nullable: true })
  metadata?: {
    periodStart: string;
    periodEnd: string;
    planName: string;
    aiCredits: number;
  };
  @Index({ name: 'invoice_user_idx' })
  @ManyToOne(() => User)
  user!: User;

  @Index({ name: 'invoice_subscription_idx' })
  @ManyToOne(() => Subscription)
  subscription!: Subscription;
}
