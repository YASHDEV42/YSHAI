import { IsInt, IsString, Length, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ModerateTextDto {
  @ApiProperty({
    description: 'Arabic text to moderate',
    maxLength: 5000,
    example: 'اشتري الآن واحصل على خصم 50%',
  })
  @IsString()
  @Length(1, 5000)
  text: string;

  @ApiProperty({ description: 'Related post ID', example: 123 })
  @IsInt()
  @Min(1)
  postId: number;
}
