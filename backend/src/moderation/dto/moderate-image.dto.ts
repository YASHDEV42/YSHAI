import { IsInt, IsUrl, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ModerateImageDto {
  @ApiProperty({
    description: 'Publicly accessible image URL to moderate',
    example: 'https://example.com/image.jpg',
  })
  @IsUrl()
  imageUrl!: string;

  @ApiProperty({ description: 'Related post ID', example: 123 })
  @IsInt()
  @Min(1)
  postId!: number;
}
