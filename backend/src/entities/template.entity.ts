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
  id!: string;

  @Property()
  name!: string;

  @Property()
  contentAr!: string;

  @Property({ nullable: true })
  contentEn?: string;

  @ManyToOne(() => User)
  owner!: User;

  @ManyToOne(() => Team, { nullable: true })
  team?: Team;

  @Property({ default: 'private' })
  visibility: 'private' | 'team' | 'public' = 'private';

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @OneToMany(() => Post, (post) => post.template)
  posts = new Collection<Post>(this);
}
