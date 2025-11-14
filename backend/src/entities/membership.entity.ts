import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Unique,
  Index,
} from '@mikro-orm/core';
import { User } from './user.entity';
import { Team } from './team.entity';

@Entity()
@Unique({ properties: ['user', 'team'] })
export class Membership {
  @PrimaryKey()
  id!: number;

  @Index()
  @ManyToOne(() => User, { fieldName: 'userId' })
  user!: User;

  @Index()
  @ManyToOne(() => Team, { fieldName: 'teamId' })
  team!: Team;

  @Property()
  role!: 'owner' | 'admin' | 'editor' | 'viewer';

  @Property({ onCreate: () => new Date() })
  joinedAt = new Date();

  @Property({ nullable: true })
  leftAt?: Date;

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, any>;
}
