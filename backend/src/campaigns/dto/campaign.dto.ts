import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CampaignResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  description?: string | null;

  @ApiProperty()
  ownerId: number;

  @ApiProperty({ required: false, nullable: true })
  teamId?: number | null;

  @ApiProperty({ enum: ['draft', 'active', 'completed', 'cancelled'] })
  status: 'draft' | 'active' | 'completed' | 'cancelled';

  @ApiProperty({ required: false, nullable: true })
  startsAt?: string | null; // FIXED: use ISO date-time string to align with Swagger and Create/UpdateCampaignDto

  @ApiProperty({ required: false, nullable: true })
  endsAt?: string | null; // FIXED: use ISO date-time string to align with Swagger and Create/UpdateCampaignDto

  @ApiProperty({ required: false, nullable: true })
  metadata?: Record<string, unknown> | null;

  @ApiProperty()
  createdAt: string; // FIXED: use ISO date-time string to match Swagger CampaignResponseDto.createdAt

  @ApiProperty()
  updatedAt: string; // FIXED: use ISO date-time string to match Swagger CampaignResponseDto.updatedAt
}

export class CreateCampaignDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: ['draft', 'active', 'completed', 'cancelled'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['draft', 'active', 'completed', 'cancelled'])
  status?: 'draft' | 'active' | 'completed' | 'cancelled';

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsDateString()
  endsAt?: string;
}

export class UpdateCampaignDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({
    enum: ['draft', 'active', 'completed', 'cancelled'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['draft', 'active', 'completed', 'cancelled'])
  status?: 'draft' | 'active' | 'completed' | 'cancelled';

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsDateString()
  startsAt?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsDateString()
  endsAt?: string | null;
}
