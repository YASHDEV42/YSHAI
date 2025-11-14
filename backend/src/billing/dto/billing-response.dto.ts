import { ApiProperty } from '@nestjs/swagger';

export class PlanResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty({ enum: ['Free', 'Pro', 'Business'] })
  name: 'Free' | 'Pro' | 'Business';

  @ApiProperty({
    description:
      'Slug used in URLs/APIs (e.g. free, pro, business, enterprise)',
  })
  slug: string;

  @ApiProperty()
  priceMonthly: number;

  @ApiProperty({ required: false, nullable: true })
  priceYearly?: number | null;

  @ApiProperty()
  maxAccounts: number;

  @ApiProperty()
  aiCreditsUnlimited: boolean;

  @ApiProperty({ required: false, nullable: true })
  aiCreditsLimit?: number | null;

  @ApiProperty()
  maxPostsPerMonth: number;

  @ApiProperty()
  maxScheduledPosts: number;

  @ApiProperty()
  teamCollaboration: boolean;

  @ApiProperty()
  analyticsExport: boolean;

  @ApiProperty()
  prioritySupport: boolean;

  @ApiProperty({ required: false, nullable: true })
  metadata?: Record<string, any> | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class SubscriptionResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty({
    enum: [
      'active',
      'canceled',
      'past_due',
      'trialing',
      'incomplete',
      'incomplete_expired',
    ],
  })
  status:
    | 'active'
    | 'canceled'
    | 'past_due'
    | 'trialing'
    | 'incomplete'
    | 'incomplete_expired';
  @ApiProperty()
  periodStartsAt: string; // FIXED: use ISO date-time string to match Swagger SubscriptionResponseDto.periodStartsAt
  @ApiProperty()
  periodEndsAt: string; // FIXED: use ISO date-time string to match Swagger SubscriptionResponseDto.periodEndsAt
  @ApiProperty({ required: false, nullable: true })
  canceledAt?: Date | null;
  @ApiProperty({ required: false, nullable: true })
  paymentGatewaySubscriptionId?: string | null;
  @ApiProperty()
  createdAt: string; // FIXED: use ISO date-time string to match Swagger SubscriptionResponseDto.createdAt
  @ApiProperty()
  updatedAt: string; // FIXED: use ISO date-time string to match Swagger SubscriptionResponseDto.updatedAt
  @ApiProperty()
  planId: number;
}

export class InvoiceResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  amount: number;
  @ApiProperty({ enum: ['SAR', 'USD', 'EUR'] })
  currency: 'SAR' | 'USD' | 'EUR';
  @ApiProperty({ enum: ['paid', 'unpaid', 'refunded', 'failed'] })
  status: 'paid' | 'unpaid' | 'refunded' | 'failed';
  @ApiProperty({ required: false, nullable: true })
  paymentGatewayId?: string | null;
  @ApiProperty({ required: false, nullable: true })
  paymentMethod?: string | null;
  @ApiProperty()
  issuedAt: string; // FIXED: use ISO date-time string to match Swagger InvoiceResponseDto.issuedAt
  @ApiProperty({ required: false, nullable: true })
  paidAt?: string | null; // FIXED: use ISO date-time string (nullable) for Swagger InvoiceResponseDto.paidAt
  @ApiProperty({ required: false, nullable: true })
  downloadedAt?: string | null; // FIXED: use ISO date-time string (nullable) for Swagger InvoiceResponseDto.downloadedAt
  @ApiProperty({ required: false, nullable: true })
  pdfUrl?: string | null;
  @ApiProperty({ required: false, type: Object, nullable: true })
  metadata?: Record<string, any> | null;
}
