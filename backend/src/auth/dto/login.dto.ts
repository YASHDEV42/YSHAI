import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    maxLength: 50,
    minLength: 5,
    type: 'string',
    format: 'email',
  })
  @IsEmail()
  @MaxLength(50)
  @MinLength(5)
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'strongPass123',
    minLength: 6,
    maxLength: 100,
    type: 'string',
    format: 'password',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;
}
