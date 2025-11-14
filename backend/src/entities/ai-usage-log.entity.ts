import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/core';
import { User } from './user.entity';
import { Subscription } from './subscription.entity';
import { Generation } from './generation.entity';

@Entity()
export class AIUsageLog {
  @PrimaryKey()
  id!: number;

  @Index()
  @ManyToOne(() => User, { fieldName: 'userId' })
  user!: User;

  @Index()
  @ManyToOne(() => Subscription, {
    fieldName: 'subscriptionId',
    nullable: true,
  })
  subscription?: Subscription;

  @ManyToOne(() => Generation, {
    fieldName: 'generationId',
    nullable: true,
  })
  generation?: Generation;

  @Property()
  modelUsed!: string; // "gpt-4.1-mini", "llama3-70b", ...

  @Property()
  inputTokens!: number;

  @Property()
  outputTokens!: number;

  @Property()
  costUsd!: number;

  @Index()
  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, any>; // latency, prompt version, warnings, etc.
}
