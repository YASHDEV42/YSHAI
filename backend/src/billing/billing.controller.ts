import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BillingService } from './billing.service';
import { Plan } from 'src/entities/plan.entity';
import { Invoice } from 'src/entities/invoice.entity';
import { SubscribeDto } from './dto/subscribe.dto';
import { Subscription } from 'src/entities/subscription.entity';

@ApiTags('Billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Get('plans')
  @ApiOperation({ summary: 'List available plans' })
  async listPlans(): Promise<Plan[]> {
    return this.billing.listPlans();
  }

  @Post('subscribe')
  @ApiOperation({ summary: 'Create or switch subscription' })
  async subscribe(
    @Req() req: { user: { id: number } },
    @Body() dto: SubscribeDto,
  ): Promise<{ subscription: Subscription; clientSecret?: string }> {
    return this.billing.subscribe(
      req.user.id,
      dto.planId,
      dto.paymentMethod,
      dto.couponCode,
    );
  }

  @Delete('cancel')
  @ApiOperation({ summary: 'Cancel current subscription' })
  async cancel(
    @Req() req: { user: { id: number } },
  ): Promise<{ message: string }> {
    return this.billing.cancel(req.user.id);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'List invoices for current user' })
  async invoices(@Req() req: { user: { id: number } }): Promise<Invoice[]> {
    return this.billing.invoices(req.user.id);
  }

  @Post('callback')
  @ApiOperation({ summary: 'Payment gateway callback' })
  callback(@Body() payload: Record<string, unknown>): { ok: true } {
    return this.billing.handleCallback(payload);
  }
}
