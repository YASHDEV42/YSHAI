import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateMemberRoleDto {
  @ApiProperty({
    description: 'New role for the team member',
    enum: ['admin', 'editor', 'viewer'],
    example: 'admin',
    type: String,
  })
  @IsEnum(['admin', 'editor', 'viewer'])
  role: 'admin' | 'editor' | 'viewer';
}
