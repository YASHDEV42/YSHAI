import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TemplateResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  contentAr: string;

  @ApiProperty({ required: false, nullable: true })
  contentEn?: string | null;

  @ApiProperty({ required: false, nullable: true })
  description?: string | null;

  @ApiProperty()
  ownerId: number;

  @ApiProperty({ required: false, nullable: true })
  teamId?: number | null;

  @ApiProperty({ enum: ['private', 'team', 'public'] })
  visibility: 'private' | 'team' | 'public';

  @ApiProperty({ required: false, nullable: true, enum: ['ar', 'en'] })
  language?: 'ar' | 'en' | null;

  @ApiProperty({ required: false, nullable: true })
  metadata?: Record<string, unknown> | null;

  @ApiProperty()
  createdAt: string; // FIXED: use ISO date-time string to match Swagger TemplateResponseDto.createdAt

  @ApiProperty()
  updatedAt: string; // FIXED: use ISO date-time string to match Swagger TemplateResponseDto.updatedAt
}

export class CreateTemplateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contentAr: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  contentEn?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ['private', 'team', 'public'], required: false })
  @IsOptional()
  @IsEnum(['private', 'team', 'public'])
  visibility?: 'private' | 'team' | 'public';

  @ApiProperty({ required: false, nullable: true, enum: ['ar', 'en'] })
  @IsOptional()
  @IsEnum(['ar', 'en'])
  language?: 'ar' | 'en';
}

export class UpdateTemplateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contentAr?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  contentEn?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({ enum: ['private', 'team', 'public'], required: false })
  @IsOptional()
  @IsEnum(['private', 'team', 'public'])
  visibility?: 'private' | 'team' | 'public';

  @ApiProperty({ required: false, nullable: true, enum: ['ar', 'en'] })
  @IsOptional()
  @IsEnum(['ar', 'en'])
  language?: 'ar' | 'en' | null;
}
