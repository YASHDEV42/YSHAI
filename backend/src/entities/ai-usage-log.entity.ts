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
import type { WrapperType } from 'src/types/relation-wrapper';

@Entity()
export class AIUsageLog {
  @PrimaryKey()
  id!: number;

  @Index()
  @ManyToOne(() => User, { fieldName: 'userId' })
  user!: WrapperType<User>;

  @Index()
  @ManyToOne(() => Subscription, {
    fieldName: 'subscriptionId',
    nullable: true,
  })
  subscription?: WrapperType<Subscription>;

  @ManyToOne(() => Generation, {
    fieldName: 'generationId',
    nullable: true,
  })
  generation?: WrapperType<Generation>;

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
