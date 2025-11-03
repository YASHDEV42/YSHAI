import { ApiProperty } from '@nestjs/swagger';
export class TokensResponseDto {
  @ApiProperty()
  accessToken: string;
}
