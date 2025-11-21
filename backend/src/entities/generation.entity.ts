import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Post } from './post.entity';
import { User } from './user.entity';
import type { WrapperType } from 'src/types/relation-wrapper';

@Entity()
export class Generation {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Post, { fieldName: 'postId' })
  post!: WrapperType<Post>;

  @ManyToOne(() => User, { fieldName: 'userId' })
  user!: WrapperType<User>;

  @Property()
  prompt!: string;

  @Property()
  text!: string;

  @Property()
  dialect!: 'MSA' | 'Gulf' | 'Levantine' | 'Egyptian';

  @Property()
  tone!: 'formal' | 'casual' | 'humorous' | 'promotional';

  @Property({ nullable: true })
  model?: string;

  @Property({ nullable: true })
  temperature?: number;

  @Property({ nullable: true })
  maxTokens?: number;

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, any>; // Flexible JSON data

  @Property({ onCreate: () => new Date() })
  generatedAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
