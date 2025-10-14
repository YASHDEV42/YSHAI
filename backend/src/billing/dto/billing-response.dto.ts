import { ApiProperty } from '@nestjs/swagger';

export class PlanResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty({ enum: ['Free', 'Pro', 'Business'] })
  name: 'Free' | 'Pro' | 'Business';
  @ApiProperty()
  priceMonthly: number;
  @ApiProperty()
  maxAccounts: number;
  @ApiProperty()
  aiCreditsUnlimited: boolean;
  @ApiProperty({ required: false, nullable: true })
  aiCreditsLimit?: number | null;
  @ApiProperty()
  teamCollaboration: boolean;
  @ApiProperty()
  analyticsExport: boolean;
  @ApiProperty()
  createdAt: Date;
}

export class SubscriptionResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty({ enum: ['active', 'canceled', 'past_due', 'trialing'] })
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  @ApiProperty()
  periodStartsAt: Date;
  @ApiProperty()
  periodEndsAt: Date;
  @ApiProperty({ required: false, nullable: true })
  canceledAt?: Date | null;
  @ApiProperty({ required: false, nullable: true })
  paymentGatewaySubscriptionId?: string | null;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
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
  issuedAt: Date;
  @ApiProperty({ required: false, nullable: true })
  paidAt?: Date | null;
  @ApiProperty({ required: false, nullable: true })
  downloadedAt?: Date | null;
  @ApiProperty({ required: false, nullable: true })
  pdfUrl?: string | null;
  @ApiProperty({ required: false, type: Object, nullable: true })
  metadata?: Record<string, any> | null;
}
