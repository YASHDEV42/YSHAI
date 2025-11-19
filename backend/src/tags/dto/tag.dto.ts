import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class TagResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  normalized: string;

  @ApiProperty()
  ownerId: number;

  @ApiProperty()
  createdAt: string;

  @ApiPropertyOptional()
  metadata?: Record<string, any> | null;
}

export class CreateTagDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdatePostTagsDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  names?: string[];
}
