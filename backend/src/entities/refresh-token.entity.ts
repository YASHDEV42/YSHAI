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

  @Index()
  @ManyToOne(() => User, { fieldName: 'userId' })
  user!: User;

  // Hashed token (NOT raw token)
  @Property()
  tokenHash!: string;

  // Device/session metadata
  @Property({ nullable: true })
  userAgent?: string;

  @Property({ nullable: true })
  ipAddress?: string;

  // Rotation timestamp
  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  // Soft-revocation
  @Property({ default: false })
  revoked = false;

  @Property({ nullable: true })
  revokedAt?: Date;

  // Hard expiration
  @Index()
  @Property()
  expiresAt!: Date;

  // Optional additional data (device name, location, risk score, etc.)
  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, any>;
}
