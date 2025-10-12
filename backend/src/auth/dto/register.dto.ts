import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    maxLength: 50,
    minLength: 5,
    type: 'string',
    format: 'email',
  })
  @IsEmail()
  @MinLength(5)
  @MaxLength(50)
  email: string;

  @ApiProperty({
    description: 'Password for authentication',
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

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Timezone of the user',
    example: 'America/New_York',
  })
  timezone: string;

  @IsString()
  @ApiProperty({
    description: 'Preferred time format of the user',
    example: '12h',
  })
  timeFormat: '12h' | '24h';
}
