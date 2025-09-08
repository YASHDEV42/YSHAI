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
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { WebhooksService } from './webhooks.service';
import { WebhookSubscription } from 'src/entities/webhook-subscription.entity';

@ApiTags('Webhooks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooks: WebhooksService) {}

  @Post()
  @ApiOperation({ summary: 'Register webhook' })
  @ApiResponse({ status: 201, description: 'Webhook registered' })
  register(
    @Req() req: { user: { id: number } },
    @Body() dto: CreateWebhookDto,
  ): Promise<{ id: number; message: string }> {
    return this.webhooks.register(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List webhooks' })
  list(@Req() req: { user: { id: number } }): Promise<WebhookSubscription[]> {
    return this.webhooks.list(req.user.id);
  }

  @Delete(':webhookId')
  @ApiOperation({ summary: 'Delete webhook' })
  @ApiParam({ name: 'webhookId', type: Number })
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
  deliveries(
    @Req() req: { user: { id: number } },
    @Param('webhookId', ParseIntPipe) webhookId: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const p = Math.max(1, Number(page) || 1);
    const l = Math.max(1, Math.min(100, Number(limit) || 20));
    return this.webhooks.listDeliveries(req.user.id, webhookId, {
      page: p,
      limit: l,
    });
  }
}
