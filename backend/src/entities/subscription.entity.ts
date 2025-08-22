import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  ManyToOne,
} from '@mikro-orm/core';
import { User } from './user.entity';
import { Plan } from './plan.entity';
import { Invoice } from './invoice.entity';

@Entity()
export class Subscription {
  @PrimaryKey()
  id!: string;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Plan)
  plan!: Plan;

  @Property()
  status: 'active' | 'canceled' | 'past_due' | 'trialing' = 'active';

  @Property()
  periodStartsAt!: Date;

  @Property()
  periodEndsAt!: Date;

  @Property({ nullable: true })
  canceledAt?: Date;

  @Property()
  paymentGatewaySubscriptionId?: string;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @OneToMany(() => Invoice, (invoice) => invoice.subscription)
  invoices = new Collection<Invoice>(this);
}
