import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class IgPostsQueryDto {
  @ApiProperty()
  @IsString()
  igUserId!: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  after?: string; // Graph paging cursor
}
