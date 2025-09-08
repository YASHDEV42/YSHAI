import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class ReschedulePostDto {
  @ApiProperty({
    description: 'New scheduled date/time',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  scheduleAt!: string;
}
