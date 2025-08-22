import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Post } from './post.entity';
import { Tag } from './tag.entity';

@Entity()
export class PostTag {
  @PrimaryKey()
  id!: string;

  @ManyToOne(() => Post)
  post!: Post;

  @ManyToOne(() => Tag)
  tag!: Tag;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();
}
