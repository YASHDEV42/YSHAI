import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Generation } from './generation.entity';
import { Post } from './post.entity';

@Entity()
export class ModerationResult {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Generation, { nullable: true })
  generation?: Generation;

  @ManyToOne(() => Post)
  @ApiProperty({
    description: 'Associated post',
    type: () => Post,
  })
  post!: Post;

  @ApiProperty({ enum: ['gemini', 'custom'] })
  @Property()
  provider: 'gemini' | 'custom' = 'gemini';

  @ApiProperty({ enum: ['allowed', 'flagged', 'blocked'] })
  @Property()
  verdict: 'allowed' | 'flagged' | 'blocked' = 'allowed';

  @ApiProperty({ description: 'Raw moderation details', required: false })
  @Property({ type: 'json', nullable: true })
  details?: Record<string, any>;

  @ApiProperty()
  @Property({ onCreate: () => new Date() })
  checkedAt = new Date();
}
