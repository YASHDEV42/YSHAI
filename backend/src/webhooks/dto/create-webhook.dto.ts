import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUrl } from 'class-validator';

export class CreateWebhookDto {
  @ApiProperty({ description: 'HTTPS endpoint to receive events' })
  @IsUrl({ require_tld: false }, { message: 'url must be a valid URL' })
  url!: string;

  @ApiProperty({
    enum: ['post.published', 'post.failed', 'account.disconnected'],
  })
  @IsEnum(['post.published', 'post.failed', 'account.disconnected'] as const)
  event!: 'post.published' | 'post.failed' | 'account.disconnected';

  @ApiProperty({ description: 'Shared secret to sign webhook payloads' })
  @IsString()
  secret!: string;
}
