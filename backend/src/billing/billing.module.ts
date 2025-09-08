import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { Plan } from 'src/entities/plan.entity';
import { Subscription } from 'src/entities/subscription.entity';
import { Invoice } from 'src/entities/invoice.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Plan, Subscription, Invoice, User],
    }),
  ],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
