import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { User } from './user.entity';
import { Team } from './team.entity';

@Entity()
export class Membership {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Team)
  team!: Team;

  @Property()
  role: 'admin' | 'editor' | 'viewer' = 'editor';

  @Property({ onCreate: () => new Date() })
  joinedAt = new Date();

  @Property({ nullable: true })
  leftAt?: Date;
}
