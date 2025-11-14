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
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminService } from './admin.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { AdminUserResponseDto } from './dto/admin-user-response.dto';
import { AdminAuditLogResponseDto } from './dto/admin-audit-log-response.dto';
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
@ApiCookieAuth()
@UseGuards(JwtAuthGuard, AdminOnlyGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'List users' })
  @ApiResponse({ status: 200, type: [AdminUserResponseDto] })
  async listUsers(): Promise<AdminUserResponseDto[]> {
    const users = await this.admin.listUsers();
    return users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt,
      deletedAt: u.deletedAt ?? null,
    }));
  }

  @Post('users/:id/ban')
  @ApiOperation({ summary: 'Ban user' })
  @ApiResponse({
    status: 200,
    schema: { properties: { message: { type: 'string' } } },
  })
  banUser(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.admin.banUser(id);
  }

  @Put('users/:id/role')
  @ApiOperation({ summary: 'Assign role' })
  @ApiResponse({
    status: 200,
    schema: { properties: { message: { type: 'string' } } },
  })
  assignRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignRoleDto,
  ): Promise<{ message: string }> {
    return this.admin.assignRole(id, dto.role);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Audit logs' })
  @ApiResponse({ status: 200, type: [AdminAuditLogResponseDto] })
  async auditLogs(): Promise<AdminAuditLogResponseDto[]> {
    const logs = await this.admin.auditLogs();
    return logs.map((l) => ({
      id: l.id,
      action: l.action,
      entityType: l.entityType ?? '',
      entityId: l.entityId ?? '',
      createdAt: l.createdAt,
    }));
  }
}
