import { ApiProperty } from '@nestjs/swagger';

export class AccountInsightsDto {
  @ApiProperty()
  accountId!: number;

  @ApiProperty()
  totalPosts!: number;

  @ApiProperty()
  totalImpressions!: number;

  @ApiProperty()
  totalClicks!: number;

  @ApiProperty()
  totalEngagements!: number; // likes + comments + shares
}
