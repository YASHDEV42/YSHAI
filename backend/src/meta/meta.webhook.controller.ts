import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { ApiStandardErrors } from 'src/common/decorators/api-standard-errors.decorator';
@ApiStandardErrors()
@Controller('meta/webhooks')
export class MetaWebhookController {
  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
      return challenge;
    }
    throw new ForbiddenException('Webhook verification failed');
  }

  @Post()
  async receiveWebhook(@Body() payload: any) {
    console.log('📩 Received webhook:', JSON.stringify(payload, null, 2));
    return { message: 'Webhook received' };
  }
}
