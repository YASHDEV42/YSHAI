import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { User } from './user.entity';

@Entity()
export class WebhookSubscription {
  @PrimaryKey()
  id!: string;

  @ManyToOne(() => User)
  user!: User;

  @Property()
  url!: string;

  @Property()
  event: 'post.published' | 'post.failed' | 'account.disconnected' =
    'post.published';

  @Property()
  active = true;

  @Property()
  secretEncrypted!: string;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();
}
