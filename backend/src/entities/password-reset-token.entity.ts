// entities/password-reset-token.entity.ts
import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/core';
import { User } from './user.entity';

@Entity()
export class PasswordResetToken {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  // Store only a hash of the token for security
  @Property()
  @Index()
  tokenHash!: string;

  @Property({ default: false })
  used = false;

  @Property()
  expiresAt!: Date;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;
}
