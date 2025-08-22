import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { PostTag } from './post-tag.entity';

@Entity()
export class Tag {
  @PrimaryKey()
  id!: string;

  @Property()
  name!: string;

  @Property()
  normalized!: string;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @OneToMany(() => PostTag, (pt) => pt.tag)
  postTags = new Collection<PostTag>(this);
}
