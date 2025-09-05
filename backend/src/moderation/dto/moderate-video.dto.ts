import { IsUrl, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ModerateVideoDto {
  @ApiProperty({
    description: 'Publicly accessible video URL to moderate',
    example: 'https://example.com/video.mp4',
  })
  @IsUrl()
  videoUrl!: string;

  @ApiProperty({
    description: 'Related post ID',
    example: 123,
  })
  @IsInt()
  @Min(1)
  postId!: number;
}
