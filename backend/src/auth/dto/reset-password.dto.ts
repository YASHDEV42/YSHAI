import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Password reset token' })
  @IsString()
  token: string;

  @ApiProperty({ minLength: 6, description: 'New password' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class ResendVerificationDto {
  @ApiProperty({
    description: 'Email to resend verification link to',
    example: 'user@example.com',
    format: 'email',
  })
  @IsString()
  email: string;
}
