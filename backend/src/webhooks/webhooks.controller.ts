import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { WebhooksService } from './webhooks.service';
// import { WebhookSubscription } from 'src/entities/webhook-subscription.entity';
import {
  PaginatedDeliveryAttemptsDto,
  // WebhookDeliveryAttemptResponseDto,
  WebhookSubscriptionResponseDto,
} from './dto/webhook-response.dto';
import { MessageDto } from 'src/common/dto/message.dto';
import { ApiStandardErrors } from 'src/common/decorators/api-standard-errors.decorator';

@ApiStandardErrors()
@ApiTags('Webhooks')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooks: WebhooksService) {}

  @Post()
  @ApiOperation({ summary: 'Register webhook' })
  @ApiResponse({
    status: 201,
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        message: { type: 'string' },
      },
      required: ['id', 'message'],
    },
  })
  register(
    @Req() req: { user: { id: number } },
    @Body() dto: CreateWebhookDto,
  ): Promise<{ id: number; message: string }> {
    return this.webhooks.register(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List webhooks' })
  async list(
    @Req() req: { user: { id: number } },
  ): Promise<WebhookSubscriptionResponseDto[]> {
    const subs = await this.webhooks.list(req.user.id);
    return subs.map((s) => ({
      id: s.id,
      url: s.url,
      event: s.event,
      active: s.active,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    }));
  }

  @Delete(':webhookId')
  @ApiOperation({ summary: 'Delete webhook' })
  @ApiParam({ name: 'webhookId', type: Number })
  @ApiResponse({ status: 200, type: MessageDto })
  remove(
    @Req() req: { user: { id: number } },
    @Param('webhookId', ParseIntPipe) webhookId: number,
  ): Promise<{ message: string }> {
    return this.webhooks.remove(req.user.id, webhookId);
  }

  @Get(':webhookId/deliveries')
  @ApiOperation({ summary: 'List delivery attempts for a webhook' })
  @ApiParam({ name: 'webhookId', type: Number })
  @ApiQuery({
    name: 'page',
    required: false,
    schema: { type: 'integer', default: 1, minimum: 1 },
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    schema: { type: 'integer', default: 20, minimum: 1, maximum: 100 },
  })
  async deliveries(
    @Req() req: { user: { id: number } },
    @Param('webhookId', ParseIntPipe) webhookId: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedDeliveryAttemptsDto> {
    const p = Math.max(1, Number(page) || 1);
    const l = Math.max(1, Math.min(100, Number(limit) || 20));
    const result = await this.webhooks.listDeliveries(req.user.id, webhookId, {
      page: p,
      limit: l,
    });
    return {
      data: result.data.map((d) => ({
        id: d.id,
        url: d.url,
        event: d.event,
        attemptNumber: d.attemptNumber,
        status: d.status,
        responseCode: d.responseCode ?? null,
        errorMessage: d.errorMessage ?? null,
        durationMs: d.durationMs ?? null,
        createdAt: d.createdAt.toISOString(),
        attemptedAt: d.attemptedAt.toISOString(),
        payloadHash: d.payloadHash,
        responseBody: d.responseBody ?? null,
      })),
      meta: result.meta,
    };
  }
}
