import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  ManyToOne,
  Collection,
} from '@mikro-orm/core';
import { Membership } from './membership.entity';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity()
export class Team {
  @PrimaryKey()
  id!: string;

  @Property()
  name!: string;

  @ManyToOne(() => User)
  owner!: User;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;

  @OneToMany(() => Membership, (membership) => membership.team)
  memberships = new Collection<Membership>(this);

  @OneToMany(() => Post, (post) => post.team)
  posts = new Collection<Post>(this);
}
