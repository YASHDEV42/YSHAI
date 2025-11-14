import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { User } from './user.entity';
import { Team } from './team.entity';
import { Post } from './post.entity';

@Entity()
export class Template {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  contentAr!: string;

  @Property({ nullable: true })
  contentEn?: string;

  @Property({ nullable: true })
  description?: string;

  @ManyToOne(() => User, { fieldName: 'ownerId' })
  owner!: User;

  @ManyToOne(() => Team, { fieldName: 'teamId', nullable: true })
  team?: Team;

  @Property()
  visibility!: 'private' | 'team' | 'public';

  @Property({ nullable: true })
  language?: 'ar' | 'en';

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;

  @OneToMany(() => Post, (post) => post.template)
  posts = new Collection<Post>(this);
}
