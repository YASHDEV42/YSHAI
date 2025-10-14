import { ApiProperty } from '@nestjs/swagger';

export class GenerateAltTextResponseDto {
  @ApiProperty({ description: 'Generated alternative text for the image' })
  altText: string;
}
