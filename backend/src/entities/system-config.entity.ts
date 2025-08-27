import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from './user.entity';

@Entity()
export class SystemConfig {
  @PrimaryKey()
  id!: number;

  @Property()
  value!: string;

  @Property({ nullable: true })
  description?: string;

  @Property()
  type: 'string' | 'number' | 'boolean' | 'json' = 'string';

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @ManyToOne(() => User, { nullable: true })
  updatedBy?: User;
}
