import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class PublishDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(2200)
  caption?: string;
}
