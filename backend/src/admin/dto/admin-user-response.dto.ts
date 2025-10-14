import { ApiProperty } from '@nestjs/swagger';

export class AdminUserResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: ['user', 'admin'] })
  role!: 'user' | 'admin';

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ nullable: true, required: false })
  deletedAt?: Date | null;
}
