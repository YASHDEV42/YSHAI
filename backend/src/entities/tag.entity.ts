import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Unique,
  Index,
  Collection,
} from '@mikro-orm/core';
import { User } from '../entities/user.entity';
import { PostTag } from './post-tag.entity';

@Entity()
@Unique({ properties: ['owner', 'normalized'] }) // unique per owner
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

  @OneToMany(() => PostTag, (pt) => pt.tag)
  postTags = new Collection<PostTag>(this);

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, any>;
}
