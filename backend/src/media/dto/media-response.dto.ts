import { ApiProperty } from '@nestjs/swagger';

export class MediaResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({
    example:
      'https://res.cloudinary.com/your-cloud/media/upload/v123/post_1.jpg',
  })
  url: string;

  @ApiProperty({ enum: ['image', 'video'], example: 'image' })
  type: 'image' | 'video';

  @ApiProperty({ example: 0 })
  orderIndex: number;

  @ApiProperty({ example: '2025-08-22T10:00:00Z', format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ example: 123, description: 'Associated post ID (if any)' })
  postId?: number;
}
