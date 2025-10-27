
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OauthCallbackDto {
  @ApiProperty()
  @IsString()
  shortToken: string;

  @ApiProperty({ example: 2 })
  @IsString()
  userId: string;
}
