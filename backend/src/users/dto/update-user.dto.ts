import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ enum: ['12h', '24h'] })
  timeFormat?: '12h' | '24h';

  @ApiPropertyOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional()
  @IsString()
  locale?: string;
}
