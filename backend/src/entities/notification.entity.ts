import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { User } from './user.entity';

@Entity()
export class Notification {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Property()
  type: 'post_scheduled' | 'publish_failed' | 'ai_ready' | 'approved' =
    'post_scheduled';

  @Property({ type: 'json' })
  payload!: Record<string, any>;

  @Property({ default: false })
  read = false;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ nullable: true })
  link?: string;
}
