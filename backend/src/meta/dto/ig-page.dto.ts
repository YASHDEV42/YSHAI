import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IgPageQueryDto {
  @ApiProperty()
  @IsString()
  igUserId!: string; // Instagram Business Account ID
}
