import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class SubscribeDto {
  @ApiProperty({ description: 'Plan ID to subscribe to' })
  @IsInt()
  planId!: number;

  @ApiProperty({ description: 'Payment method token or identifier' })
  @IsString()
  paymentMethod!: string;

  @ApiProperty({ required: false, description: 'Optional coupon code' })
  @IsOptional()
  @IsString()
  couponCode?: string;
}
