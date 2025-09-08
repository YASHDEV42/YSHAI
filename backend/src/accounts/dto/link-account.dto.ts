import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class LinkAccountDto {
  @ApiProperty({ enum: ['x', 'instagram', 'linkedin', 'tiktok'] })
  @IsIn(['x', 'instagram', 'linkedin', 'tiktok'])
  provider!: 'x' | 'instagram' | 'linkedin' | 'tiktok';

  @ApiProperty()
  @IsString()
  providerAccountId!: string;
}
