import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from '../mikro-orm.config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { MediaModule } from './media/media.module';
import { TeamsModule } from './teams/teams.module';
import { ModerationModule } from './moderation/moderation.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AiModule } from './ai/ai.module';
import { MetaModule } from './meta/meta.module';
import { AccountsModule } from './accounts/accounts.module';
import { NotificationsModule } from './notifications/notifications.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { BillingModule } from './billing/billing.module';
import { AdminModule } from './admin/admin.module';
import { PublisherModule } from './publisher/publisher.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Allow generating Swagger without DB by setting SKIP_DB=true
    ...(process.env.SKIP_DB === 'true'
      ? []
      : [MikroOrmModule.forRoot(mikroOrmConfig)]),
    AuthModule,
    UsersModule,
    PostsModule,
    MediaModule,
    TeamsModule,
    ModerationModule,
    AnalyticsModule,
    AiModule,
    MetaModule,
    AccountsModule,
    NotificationsModule,
    WebhooksModule,
    BillingModule,
    AdminModule,
    PublisherModule,
  ],
})
export class AppModule {}
