import { ApiProperty } from '@nestjs/swagger';

export class AiUsageSummaryDto {
  @ApiProperty({
    description: 'Total input tokens used in the selected period',
  })
  inputTokens!: number;

  @ApiProperty({
    description: 'Total output tokens used in the selected period',
  })
  outputTokens!: number;

  @ApiProperty({
    description: 'Total tokens (input + output) used in the selected period',
  })
  totalTokens!: number;

  @ApiProperty({ description: 'Total cost in USD for the selected period' })
  costUsd!: number;
}
