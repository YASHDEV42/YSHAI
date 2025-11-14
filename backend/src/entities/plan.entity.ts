import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
@Unique({ properties: ['slug'] })
export class Plan {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string; // "Free", "Pro", "Business", "Enterprise"

  @Property()
  slug!: string;
  // "free", "pro", "business", "enterprise"
  // Used in URLs, APIs, and plan lookups

  @Property()
  priceMonthly!: number; // store in minor units later (e.g. halalah/cents)

  @Property({ nullable: true })
  priceYearly?: number;
  // yearly discount

  // Usage limits
  @Property()
  maxAccounts!: number;

  @Property()
  aiCreditsUnlimited!: boolean;

  @Property({ nullable: true })
  aiCreditsLimit?: number;

  @Property()
  maxPostsPerMonth!: number;

  @Property()
  maxScheduledPosts!: number;

  // Feature flags
  @Property()
  teamCollaboration!: boolean;

  @Property()
  analyticsExport!: boolean;

  @Property()
  prioritySupport!: boolean;

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  // Recommended fields
  @Property()
  isActive: boolean = true; // for hiding deprecated plans

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
