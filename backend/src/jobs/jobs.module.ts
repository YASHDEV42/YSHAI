import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Job } from '../entities/job.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Job])],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
