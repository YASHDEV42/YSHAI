import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    format: 'email',
    minLength: 5,
    maxLength: 50,
  })
  @IsEmail()
  @MinLength(5)
  @MaxLength(50)
  email: string;
}
