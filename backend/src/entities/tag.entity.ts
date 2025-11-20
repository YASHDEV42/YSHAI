import {
  Entity,
  PrimaryKey,
  Property,
  Unique,
  ManyToOne,
  ManyToMany,
  Collection,
  Index,
} from '@mikro-orm/core';

import { User } from '../entities/user.entity';
import { Post } from './post.entity';
import { PostTag } from './post-tag.entity';

@Entity()
@Unique({ properties: ['owner', 'normalized'] }) // Unique tag per user
export class Tag {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User, { fieldName: 'ownerId' })
  owner!: User;

  @Property()
  name!: string;

  @Index()
  @Property()
  normalized!: string;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @ManyToMany(() => Post, (post) => post.tags, {
    pivotEntity: () => PostTag,
  })
  posts = new Collection<Post>(this);

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, any>;
}
