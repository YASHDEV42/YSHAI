import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { User } from './user.entity';
import { Generation } from './generation.entity';
import { Subscription } from './subscription.entity';

@Entity()
export class AiUsageLog {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Subscription, { nullable: true })
  subscription?: Subscription;

  @ManyToOne(() => Generation, { nullable: true })
  generation?: Generation;

  @Property()
  modelUsed: string = 'gpt-4o-mini';

  @Property()
  inputTokens!: number;

  @Property()
  outputTokens!: number;

  @Property()
  costUsd?: number;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, any>;
}
