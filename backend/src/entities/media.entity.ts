import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Post } from './post.entity';

@Entity()
export class Media {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Post, { nullable: true })
  post?: Post | null;

  @Property()
  url!: string;

  @Property()
  type: 'image' | 'video' = 'image';

  @Property({ default: 0 })
  orderIndex = 0;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();
}
