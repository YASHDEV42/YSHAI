import { Entity, PrimaryKey, Property, Index, Unique } from '@mikro-orm/core';

@Entity()
@Unique({ properties: ['key'] }) // each config key must be unique
export class SystemConfig {
  @PrimaryKey()
  id!: number;

  @Index()
  @Property()
  key!: string;
  // example: "ai.defaultModel", "maintenance.mode", "limits.dailyPosts"

  @Property({ type: 'json', nullable: true })
  value?: any;
  // stored as JSON to support any structure (string, number, array, object)

  @Property({ nullable: true })
  description?: string;

  @Property()
  type!: 'string' | 'number' | 'boolean' | 'json' | 'encrypted';

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ nullable: true })
  updatedByUserId?: number; // store *ID only*, no FK

  @Property({ nullable: true })
  deletedAt?: Date;
}
