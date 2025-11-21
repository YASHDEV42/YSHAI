import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Post } from './post.entity';
import type { WrapperType } from 'src/types/relation-wrapper';

@Entity()
export class Media {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Post, {
    nullable: true,
    fieldName: 'postId',
  })
  post?: WrapperType<Post | null>;

  @Property()
  url!: string;

  @Property()
  type!: 'image' | 'video';

  @Property({ default: 0 })
  orderIndex = 0;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();
}
