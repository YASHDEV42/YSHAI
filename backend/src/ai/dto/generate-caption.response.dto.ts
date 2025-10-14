import { ApiProperty } from '@nestjs/swagger';

export class GenerateCaptionResponseDto {
  @ApiProperty({ description: 'Generated caption text' })
  caption: string;
}
