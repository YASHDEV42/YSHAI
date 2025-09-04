import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class GenerateAltTextDto {
  @ApiProperty({ description: 'Image URL for alt text generation' })
  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({
    description: 'Optional context for the image',
    required: false,
  })
  @IsOptional()
  @IsString()
  context?: string;
}
