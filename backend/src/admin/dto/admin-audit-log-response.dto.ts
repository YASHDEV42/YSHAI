import { ApiProperty } from '@nestjs/swagger';

export class AdminAuditLogResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  action!: string;

  @ApiProperty()
  entityType!: string;

  @ApiProperty()
  entityId!: string;

  @ApiProperty()
  timestamp!: Date;
}
