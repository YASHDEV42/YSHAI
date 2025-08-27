import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'The refresh token' })
  @IsString()
  refreshToken: string;

  @ApiProperty({ description: 'The user ID associated with the refresh token' })
  @IsNumber()
  userId: number;
}
