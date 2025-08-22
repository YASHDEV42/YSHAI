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
  id!: string;

  @ManyToOne(() => User)
  user!: User;

  @Property()
  tokenHash!: string; // bcrypt hash of the token

  @Property()
  userAgent?: string; // e.g., "Chrome 128 / Windows"

  @Property()
  ipAddress?: string;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Index({ name: 'refresh_token_active_idx' })
  @Property()
  userId!: string;

  @Index()
  @Property()
  revoked = false;

  @Index()
  @Property()
  expiresAt!: Date;
}
