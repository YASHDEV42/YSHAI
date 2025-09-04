import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UploadMediaDto {
  @ApiProperty({
    description: 'ID of the post to associate this media with (optional)',
    example: 123,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  postId?: number;
}
