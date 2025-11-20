import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Post } from './post.entity';
import { Tag } from './tag.entity';

@Entity()
export class PostTag {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Post, { fieldName: 'postId' })
  post!: Post;

  @ManyToOne(() => Tag, { fieldName: 'tagId' })
  tag!: Tag;
}
