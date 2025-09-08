import { ApiProperty } from '@nestjs/swagger';

export class CampaignInsightsDto {
  @ApiProperty()
  campaignId!: number;

  @ApiProperty()
  posts!: number;

  @ApiProperty()
  impressions!: number;

  @ApiProperty()
  clicks!: number;

  @ApiProperty()
  engagements!: number; // likes + comments + shares
}
