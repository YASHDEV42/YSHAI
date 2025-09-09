import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  Index,
} from '@mikro-orm/core';
import { User } from './user.entity';
import { Team } from './team.entity';
import { Media } from './media.entity';
import { Job } from './job.entity';
import { Generation } from './generation.entity';
import { PostAnalytics } from './post-analytics.entity';
import { Campaign } from './campaign.entity';
import { Template } from './template.entity';
import { PostTarget } from './post-target.entity';

@Entity()
export class Post {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  author!: User;

  @ManyToOne(() => Team, { nullable: true })
  team?: Team;

  // Targets now live in PostTarget; keep this for backward compat only if needed

  @Property()
  contentAr!: string;

  @Property({ nullable: true })
  contentEn?: string;

  @Property({ default: 'draft' })
  status: 'draft' | 'scheduled' | 'published' | 'failed' | 'pending_approval' =
    'draft';

  @Property({ default: false })
  isRecurring = false;

  @Property({ nullable: true })
  publishedAt?: Date;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;

  @OneToMany(() => Media, (media) => media.post)
  media = new Collection<Media>(this);

  @OneToMany(() => Job, (job) => job.post)
  jobs = new Collection<Job>(this);

  @OneToMany(() => PostTarget, (target) => target.post)
  targets = new Collection<PostTarget>(this);

  @OneToMany(() => Generation, (gen) => gen.post)
  generations = new Collection<Generation>(this);

  @OneToMany(() => PostAnalytics, (analytics) => analytics.post)
  analytics = new Collection<PostAnalytics>(this);

  @ManyToOne(() => Campaign, { nullable: true })
  campaign?: Campaign;

  @ManyToOne(() => Template, { nullable: true })
  template?: Template;

  @Index({ name: 'post_schedule_status_idx' })
  @Property()
  scheduleAt!: Date;
}
