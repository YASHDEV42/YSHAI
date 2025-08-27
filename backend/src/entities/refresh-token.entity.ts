import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/core';
import { User } from './user.entity';
@Entity()
export class RefreshToken {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Property()
  tokenHash!: string;

  @Property()
  userAgent?: string;

  @Property()
  ipAddress?: string;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Index({ name: 'refresh_token_active_idx' })
  @Property({ persist: false })
  get userId(): number {
    return this.user.id;
  }

  @Index()
  @Property()
  revoked = false;

  @Index()
  @Property()
  expiresAt!: Date;
}
