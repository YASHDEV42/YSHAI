import { ApiProperty } from '@nestjs/swagger';

export class AiUsageLogResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  userId!: number;

  @ApiProperty({ required: false, nullable: true })
  subscriptionId?: number | null;

  @ApiProperty({ required: false, nullable: true })
  generationId?: number | null;

  @ApiProperty()
  modelUsed!: string;

  @ApiProperty()
  inputTokens!: number;

  @ApiProperty()
  outputTokens!: number;

  @ApiProperty()
  costUsd!: number;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty({ required: false, nullable: true })
  metadata?: Record<string, unknown> | null;
}
