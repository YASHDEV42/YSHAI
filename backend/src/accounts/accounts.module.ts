import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from 'src/entities/user.entity';
import { SocialAccount } from 'src/entities/social-account.entity';
import { AccountToken } from 'src/entities/account-token.entity';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [User, SocialAccount, AccountToken],
    }),
    HttpModule.register({ timeout: 10_000 }),
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
