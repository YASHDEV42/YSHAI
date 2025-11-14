import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  ManyToOne,
  Index,
} from '@mikro-orm/core';
import { User } from './user.entity';
import { Plan } from './plan.entity';
import { Invoice } from './invoice.entity';

@Entity()
export class Subscription {
  @PrimaryKey()
  id!: number;

  @Index()
  @ManyToOne(() => User, { fieldName: 'userId' })
  user!: User;

  @Index()
  @ManyToOne(() => Plan, { fieldName: 'planId' })
  plan!: Plan;

  @Property()
  status!:
    | 'active'
    | 'canceled'
    | 'past_due'
    | 'trialing'
    | 'incomplete'
    | 'incomplete_expired';

  @Property({ nullable: true })
  trialEndsAt?: Date;

  @Property()
  periodStartsAt!: Date;

  @Property()
  periodEndsAt!: Date;

  @Property({ nullable: true })
  canceledAt?: Date;

  @Property({ nullable: true })
  cancelAtPeriodEnd?: boolean;

  @Property({ nullable: true })
  paymentGatewaySubscriptionId?: string;

  @Property({ nullable: true })
  paymentGatewayCustomerId?: string;

  @Property({ nullable: true })
  lastPaymentAt?: Date;

  @Property({ nullable: true })
  nextBillingAt?: Date;

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;

  @OneToMany(() => Invoice, (invoice) => invoice.subscription)
  invoices = new Collection<Invoice>(this);
}
