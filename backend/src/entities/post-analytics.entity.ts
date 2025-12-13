import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
  Unique,
} from '@mikro-orm/core';
import { PostTarget } from './post-target.entity';
import type { WrapperType } from 'src/types/relation-wrapper';

export type AnalyticsGranularity = 'day' | 'hour';

@Entity()
@Index({ properties: ['postTarget', 'periodStart'] })
@Index({ properties: ['fetchedAt'] })
@Unique({
  properties: ['postTarget', 'granularity', 'periodStart'],
})
export class PostAnalytics {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => PostTarget, { fieldName: 'postTargetId' })
  postTarget!: WrapperType<PostTarget>;

  @Property()
  granularity: AnalyticsGranularity = 'day';

  @Property()
  periodStart!: Date;

  @Property({ nullable: true })
  periodEnd?: Date;

  @Property({ default: 0 })
  impressions = 0;

  @Property({ default: 0 })
  reach = 0;

  @Property({ default: 0 })
  likes = 0;

  @Property({ default: 0 })
  comments = 0;

  @Property({ default: 0 })
  shares = 0;

  @Property({ default: 0 })
  clicks = 0;

  @Index()
  @Property()
  fetchedAt: Date = new Date();

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, any>;
}
