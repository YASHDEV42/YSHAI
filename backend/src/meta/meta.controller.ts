import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MetaService } from './meta.service';

@ApiTags('Meta')
@Controller()
export class MetaController {
  constructor(private readonly meta: MetaService) {}

  @Get()
  @ApiOperation({ summary: 'Root' })
  root(): string {
    return 'Hello World!';
  }

  @Get('health')
  @ApiOperation({ summary: 'Health Check' })
  health() {
    return { status: 'ok', time: new Date().toISOString() };
  }

  @Get('meta/timezones')
  @ApiOperation({ summary: 'List Timezones' })
  listTimezones(): string[] {
    return this.meta.listTimezones();
  }

  @Get('meta/locales')
  @ApiOperation({ summary: 'List Locales' })
  listLocales(): string[] {
    return this.meta.listLocales();
  }
}
