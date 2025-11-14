import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  ManyToOne,
} from '@mikro-orm/core';
import { User } from './user.entity';
import { Membership } from './membership.entity';
import { Post } from './post.entity';
import { Template } from './template.entity';

@Entity()
export class Team {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @ManyToOne(() => User, { fieldName: 'ownerId' })
  owner!: User;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  avatarUrl?: string;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;

  @OneToMany(() => Membership, (membership) => membership.team)
  members = new Collection<Membership>(this);

  @OneToMany(() => Post, (post) => post.team)
  posts = new Collection<Post>(this);

  @OneToMany(() => Template, (template) => template.team)
  templates = new Collection<Template>(this);
}
