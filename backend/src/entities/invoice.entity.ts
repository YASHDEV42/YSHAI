import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  ManyToOne,
} from '@mikro-orm/core';
import { User } from './user.entity';
import { Subscription } from './subscription.entity';
import type { WrapperType } from 'src/types/relation-wrapper';

@Entity()
export class Invoice {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User, { fieldName: 'userId' })
  @Index({ name: 'invoice_user_idx' })
  user!: WrapperType<User>;

  @ManyToOne(() => Subscription, {
    fieldName: 'subscriptionId',
    nullable: true,
  })
  @Index({ name: 'invoice_subscription_idx' })
  subscription?: WrapperType<Subscription>;

  @Property()
  amount!: number; // Store as float or integer cents

  @Property()
  currency!: 'SAR' | 'USD' | 'EUR';

  @Property()
  status!: 'paid' | 'unpaid' | 'refunded' | 'failed';

  @Property({ nullable: true })
  paymentGatewayId?: string;
  // e.g. Stripe chargeId, PayTR transactionId

  @Property({ nullable: true })
  paymentMethod?: string;
  // e.g. "visa", "mada", "paypal", "apple-pay"

  @Property({ onCreate: () => new Date() })
  issuedAt: Date = new Date();

  @Property({ nullable: true })
  paidAt?: Date;

  @Property({ nullable: true })
  refundedAt?: Date; // <— missing originally (important)

  @Property({ nullable: true })
  downloadedAt?: Date;

  @Property({ nullable: true })
  pdfUrl?: string;

  @Property({ type: 'json', nullable: true })
  metadata?: {
    periodStart?: string;
    periodEnd?: string;
    planName?: string;
    aiCredits?: number;
    vatPercentage?: number;
    subtotal?: number;
    receiptNumber?: string;
  };

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
