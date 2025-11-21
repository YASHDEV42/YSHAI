import { ApiProperty } from '@nestjs/swagger';

export class CountDto {
  @ApiProperty({ type: Number })
  count!: number;
}
