import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'currentPassword123' })
  @MinLength(6)
  currentPassword: string;

  @ApiProperty({ example: 'newPassword123' })
  @MinLength(6)
  newPassword: string;
}
