import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    example: 409,
    description: 'HTTP status code',
  })
  statusCode: number;

  @ApiProperty({
    example: 'Email already in use',
    description: 'Human-readable error message (or list of messages)',
  })
  message: string | string[];

  @ApiProperty({
    example: 'Conflict',
    description: 'Short error name or type',
  })
  error: string;
}
