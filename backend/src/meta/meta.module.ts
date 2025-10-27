import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MetaController } from './meta.controller';
import { MetaService } from './meta.service';
import { AccountsModule } from '../accounts/accounts.module';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [
    HttpModule.register({ timeout: 10_000 }),
    AccountsModule,
    MediaModule
  ],
  controllers: [MetaController],
  providers: [MetaService],
})
export class MetaModule { }
