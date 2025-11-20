import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsObject,
} from 'class-validator';

/* ---------------------------------------------------------
 * RESPONSE DTO
 * --------------------------------------------------------- */
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

  @ApiPropertyOptional({ type: Object, nullable: true })
  metadata?: Record<string, any> | null;
}

/* ---------------------------------------------------------
 * CREATE TAG DTO
 * --------------------------------------------------------- */
export class CreateTagDto {
  @ApiProperty({ example: 'marketing' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

/* ---------------------------------------------------------
 * UPDATE TAG DTO (🔥 New)
 * --------------------------------------------------------- */
export class UpdateTagDto {
  @ApiPropertyOptional({ example: 'growth-marketing' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

/* ---------------------------------------------------------
 * UPDATE POST TAGS DTO (string names)
 * This is ONLY used for:
 *   PATCH /posts/:id/tags
 * --------------------------------------------------------- */
export class UpdatePostTagsDto {
  @ApiProperty({ type: [String], example: ['marketing', 'development'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  names?: string[];
}

/* ---------------------------------------------------------
 * GET OR CREATE TAG DTO
 * Used for POST /tags/get-or-create
 * --------------------------------------------------------- */
export class GetOrCreateTagDto {
  @ApiProperty({ example: 'marketing' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
