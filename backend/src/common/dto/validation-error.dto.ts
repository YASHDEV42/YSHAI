import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorDto {
  @ApiProperty({
    example: 400,
    description: 'HTTP status code',
  })
  statusCode: number;

  @ApiProperty({
    example: [
      'email must be an email',
      'password must be longer than or equal to 6 characters',
    ],
    description: 'List of validation error messages from class-validator',
  })
  message: string[];

  @ApiProperty({
    example: 'Bad Request',
    description: 'Error title',
  })
  error: string;
}
