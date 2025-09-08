import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdatePreferencesDto {
  @ApiPropertyOptional({ description: 'IANA timezone, e.g., America/New_York' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ description: 'BCP 47 language tag, e.g., en or ar' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    description: 'Locale for formatting, e.g., en-US or ar-EG',
  })
  @IsOptional()
  @IsString()
  locale?: string;

  @ApiPropertyOptional({ description: '12h or 24h clock format' })
  @IsOptional()
  @IsIn(['12h', '24h'])
  timeFormat?: '12h' | '24h';
}
