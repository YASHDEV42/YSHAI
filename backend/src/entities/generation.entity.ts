import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Post } from './post.entity';

@Entity()
export class Generation {
  @PrimaryKey()
  id!: string;

  @ManyToOne(() => Post)
  post!: Post;

  @Property()
  prompt!: string;

  @Property()
  text!: string;

  @Property()
  dialect: 'MSA' | 'Gulf' | 'Levantine' | 'Egyptian' = 'MSA';

  @Property()
  tone: 'formal' | 'casual' | 'humorous' | 'promotional' = 'casual';

  @Property({ onCreate: () => new Date() })
  generatedAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
