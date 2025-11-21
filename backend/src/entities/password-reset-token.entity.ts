import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Index,
} from '@mikro-orm/core';
import { User } from './user.entity';
import type { WrapperType } from 'src/types/relation-wrapper';

@Entity()
export class PasswordResetToken {
  @PrimaryKey()
  id!: number;

  @Index()
  @ManyToOne(() => User, { fieldName: 'userId' })
  user!: WrapperType<User>;

  // Store ONLY a HASH of the token
  @Property()
  tokenHash!: string;

  @Property({ default: false })
  used = false;

  @Property({ nullable: true })
  usedAt?: Date;

  @Index()
  @Property()
  expiresAt!: Date;

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, any>;
}
