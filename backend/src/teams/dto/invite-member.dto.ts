import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsEnum,
  MaxLength,
  MinLength,
} from 'class-validator';

export class InviteMemberDto {
  @ApiProperty({
    description: 'Email of the user to invite',
    example: 'member@example.com',
    type: String,
  })
  @IsString()
  @IsEmail()
  @MaxLength(100)
  @MinLength(5)
  email: string;

  @ApiProperty({
    description: 'Role to assign to the invited member',
    enum: ['admin', 'editor', 'viewer'],
    example: 'editor',
    type: String,
  })
  @IsString()
  @IsEnum(['admin', 'editor', 'viewer'])
  role: 'admin' | 'editor' | 'viewer';
}
