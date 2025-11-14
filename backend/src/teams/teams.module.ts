import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { Team } from 'src/entities/team.entity';
import { User } from 'src/entities/user.entity';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Team, User] }), MediaModule],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
