import { ApiProperty } from '@nestjs/swagger';

export class LinkAccountResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  message!: string;
}
