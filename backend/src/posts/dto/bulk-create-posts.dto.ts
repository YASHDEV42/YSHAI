import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested, ArrayMinSize } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class BulkCreatePostsDto {
  @ApiProperty({ type: [CreatePostDto] })
  @ValidateNested({ each: true })
  @Type(() => CreatePostDto)
  @ArrayMinSize(1)
  posts!: CreatePostDto[];
}
