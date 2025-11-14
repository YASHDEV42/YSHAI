import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ChangeEmailDto {
  @ApiProperty({ example: 'new-email@example.com' })
  @IsEmail()
  newEmail: string;
}
