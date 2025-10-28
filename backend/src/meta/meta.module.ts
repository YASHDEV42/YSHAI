import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MetaController } from './meta.controller';
import { MetaService } from './meta.service';
import { AccountsModule } from '../accounts/accounts.module';
import { MediaModule } from 'src/media/media.module';
import { MetaInsightsService } from './meta-insights.service';

@Module({
  imports: [
    HttpModule.register({ timeout: 10_000 }),
    AccountsModule,
    MediaModule
  ],
  controllers: [MetaController],
  providers: [MetaService, MetaInsightsService],
  exports: [MetaService, MetaInsightsService],
})
export class MetaModule { }
