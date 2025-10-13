import { ApiProperty } from '@nestjs/swagger';
export class TokensResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
