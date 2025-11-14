import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  Unique,
  Index,
} from '@mikro-orm/core';
import { PostTag } from './post-tag.entity';

@Entity()
@Unique({ properties: ['normalized'] }) // tags must be unique
export class Tag {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string; // original text, e.g. "Social Media Tips"

  @Index()
  @Property()
  normalized!: string;
  // lowercased, trimmed, slugged version
  // e.g. "social-media-tips"

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @OneToMany(() => PostTag, (pt) => pt.tag)
  postTags = new Collection<PostTag>(this);

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, any>;
}
