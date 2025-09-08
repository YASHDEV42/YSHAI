import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminService } from './admin.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
class AdminOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context
      .switchToHttp()
      .getRequest<{ user?: { role?: string } }>();
    return req.user?.role === 'admin';
  }
}

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminOnlyGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'List users' })
  listUsers() {
    return this.admin.listUsers();
  }

  @Post('users/:id/ban')
  @ApiOperation({ summary: 'Ban user' })
  banUser(@Param('id', ParseIntPipe) id: number) {
    return this.admin.banUser(id);
  }

  @Put('users/:id/role')
  @ApiOperation({ summary: 'Assign role' })
  assignRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignRoleDto,
  ) {
    return this.admin.assignRole(id, dto.role);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Audit logs' })
  auditLogs() {
    return this.admin.auditLogs();
  }
}
