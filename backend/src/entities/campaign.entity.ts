import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { User } from './user.entity';
import { Team } from './team.entity';
import { Post } from './post.entity';

@Entity()
export class Campaign {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @ManyToOne(() => User, { fieldName: 'ownerId' })
  owner!: User;

  @ManyToOne(() => Team, { fieldName: 'teamId', nullable: true })
  team?: Team;

  @Property()
  status!: 'draft' | 'active' | 'completed' | 'cancelled';

  @Property({ nullable: true })
  startsAt?: Date;

  @Property({ nullable: true })
  endsAt?: Date;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @OneToMany(() => Post, (post) => post.campaign)
  posts = new Collection<Post>(this);
}
