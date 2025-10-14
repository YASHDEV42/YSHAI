import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionResponseDto } from './billing-response.dto';

export class SubscribeResponseDto {
  @ApiProperty({ type: () => SubscriptionResponseDto })
  subscription!: SubscriptionResponseDto;

  @ApiProperty({ required: false, nullable: true })
  clientSecret?: string | null;
}
