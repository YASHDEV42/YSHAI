import { ApiProperty } from '@nestjs/swagger';

export class TeamAuditLogResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  action!: string;

  @ApiProperty({ required: false })
  entityType?: string;

  @ApiProperty({ required: false })
  entityId?: string;

  @ApiProperty()
  createdAt!: Date;
}
