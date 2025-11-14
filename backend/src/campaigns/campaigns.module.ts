import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Campaign } from '../entities/campaign.entity';
import { User } from '../entities/user.entity';
import { Team } from '../entities/team.entity';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Campaign, User, Team])],
  providers: [CampaignsService],
  controllers: [CampaignsController],
  exports: [CampaignsService],
})
export class CampaignsModule {}
