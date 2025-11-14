import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TagResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ description: 'Original tag text, e.g. "Social Media Tips"' })
  name: string;

  @ApiProperty({ description: 'Normalized, slugged version of the tag name' })
  normalized: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Arbitrary JSON metadata for the tag',
  })
  metadata?: Record<string, unknown> | null;

  @ApiProperty()
  createdAt: string; // FIXED: use ISO date-time string to match Swagger TagResponseDto.createdAt
}

export class CreateTagDto {
  @ApiProperty({ description: 'Tag name as entered by the user' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdatePostTagsDto {
  @ApiProperty({
    type: [String],
    description: 'List of tag names to apply to the post',
  })
  @IsString({ each: true })
  @IsOptional()
  names?: string[];
}
