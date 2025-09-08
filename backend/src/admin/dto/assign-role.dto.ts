import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({ enum: ['user', 'admin'] })
  @IsEnum(['user', 'admin'] as const)
  role!: 'user' | 'admin';
}
