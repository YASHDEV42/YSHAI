import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { LinkAccountDto } from './link-account.dto';

export class LinkAccountWithTokensDto extends LinkAccountDto {
  @ApiPropertyOptional({
    description: 'Short-lived access token from the provider',
  })
  @IsOptional()
  @IsString()
  accessToken?: string;

  @ApiPropertyOptional({
    description: 'Long-lived refresh token from the provider',
  })
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @ApiPropertyOptional({ description: 'Access token expiration (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
