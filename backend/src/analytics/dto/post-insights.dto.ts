import { ApiProperty } from '@nestjs/swagger';

export class PostInsightsDto {
  @ApiProperty()
  postId!: number;

  @ApiProperty()
  impressions!: number;

  @ApiProperty()
  clicks!: number;

  @ApiProperty()
  likes!: number;

  @ApiProperty()
  comments!: number;

  @ApiProperty()
  shares!: number;

  @ApiProperty()
  fetchedAt!: Date;
}
