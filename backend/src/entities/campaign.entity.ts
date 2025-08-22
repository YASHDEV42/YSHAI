import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity()
export class Campaign {
  @PrimaryKey()
  id!: string;

  @Property()
  name!: string;

  @ManyToOne(() => User)
  owner!: User;

  @Property()
  status: 'active' | 'paused' | 'completed' = 'active';

  @Property({ nullable: true })
  startsAt?: Date;

  @Property({ nullable: true })
  endsAt?: Date;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @OneToMany(() => Post, (post) => post.campaign)
  posts = new Collection<Post>(this);
}
