import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({
    description: 'Name of the team',
    example: 'Marketing Team',
    type: String,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  name: string;
}
