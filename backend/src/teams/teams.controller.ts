import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Req,
  Get,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { MessageDto } from 'src/common/dto/message.dto';
import { TeamAuditLogResponseDto } from './dto/team-audit-log.response.dto';
import { TeamResponseDto } from './dto/team-response.dto';
import { ApiStandardErrors } from 'src/common/decorators/api-standard-errors.decorator';

@ApiStandardErrors()
@ApiTags('Teams')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @ApiOperation({ summary: 'List teams for the current user' })
  @ApiOkResponse({ type: [TeamResponseDto] })
  async listMyTeams(
    @Req() req: { user: { id: number } },
  ): Promise<TeamResponseDto[]> {
    return this.teamsService.listForUser(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new team' })
  @ApiResponse({
    status: 201,
    description: 'Team created successfully',
  })
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @Req() req: { user: { id: number } },
  ) {
    const userId = req.user.id;
    return this.teamsService.create(createTeamDto, userId);
  }

  @Get(':teamId')
  @ApiOperation({ summary: 'Get team details' })
  @ApiOkResponse({ type: TeamResponseDto })
  @ApiResponse({ status: 404, description: 'Team not found or not accessible' })
  async getTeam(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Req() req: { user: { id: number } },
  ): Promise<TeamResponseDto> {
    return this.teamsService.findOneForUser(teamId, req.user.id);
  }

  @Post(':teamId/invite')
  @ApiOperation({ summary: 'Invite a member to the team' })
  @ApiResponse({
    status: 200,
    description: 'Member invited successfully',
    type: MessageDto,
  })
  async inviteMember(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() dto: InviteMemberDto,
    @Req() req: { user: { id: number } },
  ) {
    const userId = req.user.id;
    await this.teamsService.inviteMember(teamId, dto, userId);
    return { message: 'Member invited successfully' };
  }

  @Put(':teamId/members/:memberId')
  @ApiOperation({ summary: 'Update a team member’s role' })
  @ApiResponse({
    status: 200,
    description: 'Member role updated successfully',
    type: MessageDto,
  })
  async updateMemberRole(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body() dto: UpdateMemberRoleDto,
    @Req() req: { user: { id: number } },
  ) {
    const userId = req.user.id;
    await this.teamsService.updateMemberRole(teamId, memberId, dto, userId);
    return { message: 'Member role updated successfully' };
  }

  @Delete(':teamId/members/:memberId')
  @ApiOperation({ summary: 'Remove a member from the team' })
  @ApiResponse({
    status: 200,
    description: 'Member removed successfully',
    type: MessageDto,
  })
  async removeMember(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Req() req: { user: { id: number } },
  ) {
    const userId = req.user.id;
    await this.teamsService.removeMember(teamId, memberId, userId);
    return { message: 'Member removed successfully' };
  }

  @Post(':teamId/leave')
  @ApiOperation({ summary: 'Leave a team' })
  @ApiOkResponse({ type: MessageDto })
  @ApiResponse({
    status: 400,
    description: 'Owner cannot leave their own team',
  })
  @ApiResponse({ status: 404, description: 'Membership not found' })
  async leaveTeam(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Req() req: { user: { id: number } },
  ): Promise<MessageDto> {
    await this.teamsService.leaveTeam(teamId, req.user.id);
    return { message: 'Left team successfully' };
  }

  @Post(':teamId/posts/:postId/approve')
  @ApiOperation({ summary: 'Approve a post for publishing' })
  async approvePost(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Req() req: { user: { id: number } },
  ): Promise<{ message: string }> {
    await this.teamsService.approvePost(teamId, postId, req.user.id);
    return { message: 'Post approved' } as const;
  }

  @Post(':teamId/posts/:postId/reject')
  @ApiOperation({ summary: 'Reject a post' })
  async rejectPost(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Req() req: { user: { id: number } },
  ): Promise<{ message: string }> {
    await this.teamsService.rejectPost(teamId, postId, req.user.id);
    return { message: 'Post rejected' } as const;
  }

  @Get(':teamId/audit-logs')
  @ApiOperation({ summary: 'List team audit logs' })
  @ApiResponse({ status: 200, type: [TeamAuditLogResponseDto] })
  async listAuditLogs(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Req() req: { user: { id: number } },
  ): Promise<TeamAuditLogResponseDto[]> {
    return this.teamsService.listAuditLogs(teamId, req.user.id);
  }

  @Post(':teamId/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload or update a team avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Avatar image file (PNG or JPEG)',
        },
      },
      required: ['file'],
    },
  })
  @ApiOkResponse({ type: TeamResponseDto })
  @ApiResponse({
    status: 403,
    description: 'Only the owner can update team avatar',
  })
  async uploadAvatar(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Req() req: { user: { id: number } },
    @UploadedFile() file: { path?: string; buffer?: Buffer },
  ): Promise<TeamResponseDto> {
    return this.teamsService.uploadAvatarFromFile(teamId, req.user.id, file);
  }

  @Delete(':teamId/avatar')
  @ApiOperation({ summary: 'Remove a team avatar' })
  @ApiOkResponse({ type: TeamResponseDto })
  @ApiResponse({
    status: 403,
    description: 'Only the owner can update team avatar',
  })
  async removeAvatar(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Req() req: { user: { id: number } },
  ): Promise<TeamResponseDto> {
    return this.teamsService.updateAvatarUrl(teamId, req.user.id, null);
  }

  @Delete(':teamId')
  @ApiOperation({ summary: 'Delete a team' })
  @ApiOkResponse({ type: MessageDto })
  @ApiResponse({
    status: 403,
    description: 'Only the owner can delete the team',
  })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async deleteTeam(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Req() req: { user: { id: number } },
  ): Promise<MessageDto> {
    await this.teamsService.deleteTeam(teamId, req.user.id);
    return { message: 'Team deleted successfully' };
  }
}
