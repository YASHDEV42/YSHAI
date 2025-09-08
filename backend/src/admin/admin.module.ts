import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from 'src/entities/user.entity';
import { AuditLog } from 'src/entities/audit-log.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User, AuditLog])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
