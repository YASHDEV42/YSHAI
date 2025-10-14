import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MetaService } from './meta.service';

@ApiTags('Meta')
@Controller()
export class MetaController {
  constructor(private readonly meta: MetaService) {}

  @Get()
  @ApiOperation({ summary: 'Root' })
  @ApiResponse({ status: 200, schema: { type: 'string' } })
  root(): string {
    return 'Hello World!';
  }

  @Get('health')
  @ApiOperation({ summary: 'Health Check' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        time: { type: 'string' },
      },
      required: ['status', 'time'],
    },
  })
  health() {
    return { status: 'ok', time: new Date().toISOString() };
  }

  @Get('meta/timezones')
  @ApiOperation({ summary: 'List Timezones' })
  @ApiResponse({
    status: 200,
    schema: { type: 'array', items: { type: 'string' } },
  })
  listTimezones(): string[] {
    return this.meta.listTimezones();
  }

  @Get('meta/locales')
  @ApiOperation({ summary: 'List Locales' })
  @ApiResponse({
    status: 200,
    schema: { type: 'array', items: { type: 'string' } },
  })
  listLocales(): string[] {
    return this.meta.listLocales();
  }
}
