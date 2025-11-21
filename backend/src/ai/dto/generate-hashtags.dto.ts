import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class GenerateHashtagsDto {
  @ApiProperty({ description: 'Text to generate hashtags for' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    description: 'Number of hashtags to generate',
    default: 5,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  count = 5;
}
