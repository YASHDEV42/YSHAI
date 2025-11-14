import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error-response.dto';
import { ValidationErrorDto } from '../dto/validation-error.dto';

export function ApiStandardErrors() {
  return applyDecorators(
    ApiBadRequestResponse({
      type: ValidationErrorDto,
      description: 'Validation failed',
    }),
    ApiUnauthorizedResponse({
      type: ErrorResponseDto,
      description: 'Unauthorized',
    }),
    ApiForbiddenResponse({
      type: ErrorResponseDto,
      description: 'Forbidden',
    }),
    ApiNotFoundResponse({
      type: ErrorResponseDto,
      description: 'Resource not found',
    }),
    ApiConflictResponse({
      type: ErrorResponseDto,
      description: 'Conflict (duplicate email, duplicate record, etc.)',
    }),
  );
}
