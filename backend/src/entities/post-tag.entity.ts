import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Unique,
  Index,
} from '@mikro-orm/core';
import { Post } from './post.entity';
import { Tag } from './tag.entity';

@Entity()
@Unique({ properties: ['post', 'tag'] })
export class PostTag {
  @PrimaryKey()
  id!: number;

  @Index()
  @ManyToOne(() => Post, { fieldName: 'postId' })
  post!: Post;

  @Index()
  @ManyToOne(() => Tag, { fieldName: 'tagId' })
  tag!: Tag;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();
}
