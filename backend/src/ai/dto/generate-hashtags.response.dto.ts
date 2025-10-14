import { ApiProperty } from '@nestjs/swagger';

export class GenerateHashtagsResponseDto {
  @ApiProperty({ description: 'Generated hashtags string with #' })
  hashtags: string;
}
