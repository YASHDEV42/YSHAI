import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BillingService } from './billing.service';
// import { Plan } from 'src/entities/plan.entity';
// import { Invoice } from 'src/entities/invoice.entity';
import { SubscribeDto } from './dto/subscribe.dto';
// import { Subscription } from 'src/entities/subscription.entity';
import {
  InvoiceResponseDto,
  PlanResponseDto,
  SubscriptionResponseDto,
} from './dto/billing-response.dto';
import { SubscribeResponseDto } from './dto/subscribe-response.dto';

@ApiTags('Billing')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Get('plans')
  @ApiOperation({ summary: 'List available plans' })
  @ApiResponse({ status: 200, type: [PlanResponseDto] })
  async listPlans(): Promise<PlanResponseDto[]> {
    const plans = await this.billing.listPlans();
    return plans.map((p) => ({
      id: p.id,
      name: p.name as 'Free' | 'Pro' | 'Business',
      slug: p.slug,
      priceMonthly: p.priceMonthly,
      priceYearly: p.priceYearly ?? null,
      maxAccounts: p.maxAccounts,
      aiCreditsUnlimited: p.aiCreditsUnlimited,
      aiCreditsLimit: p.aiCreditsLimit ?? null,
      maxPostsPerMonth: p.maxPostsPerMonth,
      maxScheduledPosts: p.maxScheduledPosts,
      teamCollaboration: p.teamCollaboration,
      analyticsExport: p.analyticsExport,
      prioritySupport: p.prioritySupport,
      metadata:
        (p as unknown as { metadata?: Record<string, any> }).metadata ?? null,
      isActive: p.isActive,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  }

  @Post('subscribe')
  @ApiOperation({ summary: 'Create or switch subscription' })
  @ApiResponse({ status: 200, type: SubscribeResponseDto })
  async subscribe(
    @Req() req: { user: { id: number } },
    @Body() dto: SubscribeDto,
  ): Promise<{ subscription: SubscriptionResponseDto; clientSecret?: string }> {
    const result = await this.billing.subscribe(
      req.user.id,
      dto.planId,
      dto.paymentMethod,
      dto.couponCode,
    );
    const s = result.subscription;
    return {
      subscription: {
        id: s.id,
        status: s.status,
        periodStartsAt: s.periodStartsAt.toISOString(), // FIXED: DTO expects string
        periodEndsAt: s.periodEndsAt.toISOString(), // FIXED: DTO expects string
        canceledAt: s.canceledAt ?? null,
        paymentGatewaySubscriptionId: s.paymentGatewaySubscriptionId ?? null,
        createdAt: s.createdAt.toISOString(), // FIXED: DTO expects string
        updatedAt: s.updatedAt.toISOString(), // FIXED: DTO expects string
        planId:
          (s as unknown as { plan?: { id: number } }).plan?.id ??
          (s as unknown as { planId?: number }).planId ??
          0,
      },
      clientSecret: result.clientSecret,
    };
  }

  @Delete('cancel')
  @ApiOperation({ summary: 'Cancel current subscription' })
  @ApiResponse({
    status: 200,
    schema: { properties: { message: { type: 'string' } } },
  })
  async cancel(
    @Req() req: { user: { id: number } },
  ): Promise<{ message: string }> {
    return this.billing.cancel(req.user.id);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'List invoices for current user' })
  @ApiResponse({ status: 200, type: [InvoiceResponseDto] })
  async invoices(
    @Req() req: { user: { id: number } },
  ): Promise<InvoiceResponseDto[]> {
    const invoices = await this.billing.invoices(req.user.id);
    return invoices.map((i) => ({
      id: i.id,
      amount: i.amount,
      currency: i.currency,
      status: i.status,
      paymentGatewayId: i.paymentGatewayId ?? null,
      paymentMethod: i.paymentMethod ?? null,
      issuedAt: i.issuedAt.toISOString(), // FIXED: DTO expects string
      paidAt: i.paidAt ? i.paidAt.toISOString() : null, // FIXED: DTO expects string | null
      downloadedAt: i.downloadedAt ? i.downloadedAt.toISOString() : null, // FIXED: DTO expects string | null
      pdfUrl: i.pdfUrl ?? null,
      metadata:
        (i as unknown as { metadata?: Record<string, any> }).metadata ?? null,
    }));
  }

  @Post('callback')
  @ApiOperation({ summary: 'Payment gateway callback' })
  callback(@Body() payload: Record<string, unknown>): { ok: true } {
    return this.billing.handleCallback(payload);
  }
}
