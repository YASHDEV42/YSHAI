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
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

@ApiTags('teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

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

  @Post(':teamId/invite')
  @ApiOperation({ summary: 'Invite a member to the team' })
  @ApiResponse({ status: 200, description: 'Member invited successfully' })
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
  @ApiResponse({ status: 200, description: 'Member role updated successfully' })
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
  @ApiResponse({ status: 200, description: 'Member removed successfully' })
  async removeMember(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Req() req: { user: { id: number } },
  ) {
    const userId = req.user.id;
    await this.teamsService.removeMember(teamId, memberId, userId);
    return { message: 'Member removed successfully' };
  }
}
