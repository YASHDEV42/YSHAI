import { ApiProperty } from '@nestjs/swagger';

export class AiUsageByModelDto {
  @ApiProperty({ description: 'Model identifier, e.g. gemini-1.5-pro' })
  model!: string;

  @ApiProperty()
  inputTokens!: number;

  @ApiProperty()
  outputTokens!: number;

  @ApiProperty()
  totalTokens!: number;

  @ApiProperty()
  costUsd!: number;
}

export class AiUsageBreakdownDto {
  @ApiProperty({ type: () => [AiUsageByModelDto] })
  byModel!: AiUsageByModelDto[];
}
