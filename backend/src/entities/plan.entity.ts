import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Plan {
  @PrimaryKey()
  id!: number;

  @Property()
  name: 'Free' | 'Pro' | 'Business' = 'Free';

  @Property()
  priceMonthly: number = 0;

  @Property()
  maxAccounts = 5;

  @Property()
  aiCreditsUnlimited = false;

  @Property()
  aiCreditsLimit?: number;

  @Property()
  teamCollaboration = false;

  @Property()
  analyticsExport = false;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();
}
