import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IgProfileQueryDto {
  @ApiProperty()
  @IsString()
  pageId!: string; // facebook Page ID linked to IG Business account
}
