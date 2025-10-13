import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  token: string;

  @ApiProperty({ minLength: 6 })
  newPassword: string;
}
