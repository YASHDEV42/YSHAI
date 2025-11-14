// teams/teams.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Team } from 'src/entities/team.entity';
import { User } from 'src/entities/user.entity';
import { Membership } from 'src/entities/membership.entity';
import { Post } from 'src/entities/post.entity';
import { AuditLog } from 'src/entities/audit-log.entity';
import { Subscription } from 'src/entities/subscription.entity';
import { Plan } from 'src/entities/plan.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { TeamResponseDto } from './dto/team-response.dto';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class TeamsService {
  constructor(
    private readonly em: EntityManager,
    private readonly mediaService: MediaService,
  ) {}

  async create(createTeamDto: CreateTeamDto, ownerId: number): Promise<Team> {
    const owner = await this.em.findOne(User, { id: ownerId });
    if (!owner) {
      throw new NotFoundException(`Owner with ID ${ownerId} not found`);
    }

    const team = this.em.create(Team, {
      ...createTeamDto,
      owner,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.em.create(Membership, {
      user: owner,
      team,
      role: 'admin',
      joinedAt: new Date(),
    });

    await this.em.persistAndFlush(team);
    return team;
  }

  async listForUser(userId: number): Promise<TeamResponseDto[]> {
    const memberships = await this.em.find(
      Membership,
      { user: userId, leftAt: null },
      { populate: ['team', 'team.owner'] },
    );

    return memberships
      .filter((m) => !m.team.deletedAt)
      .map((m) => ({
        id: m.team.id,
        name: m.team.name,
        description: m.team.description ?? null,
        avatarUrl: m.team.avatarUrl ?? null,
        ownerId: m.team.owner.id,
        role: (m.role === 'admin' && m.team.owner.id === userId
          ? 'owner'
          : m.role) as TeamResponseDto['role'],
        createdAt: m.team.createdAt.toISOString(),
        updatedAt: m.team.updatedAt.toISOString(),
      }));
  }

  async findOneForUser(
    teamId: number,
    userId: number,
  ): Promise<TeamResponseDto> {
    const membership = await this.em.findOne(
      Membership,
      { user: userId, team: teamId, leftAt: null },
      { populate: ['team', 'team.owner'] },
    );

    if (!membership || membership.team.deletedAt) {
      throw new NotFoundException('Team not found or not accessible');
    }

    const team = membership.team;
    return {
      id: team.id,
      name: team.name,
      description: team.description ?? null,
      avatarUrl: team.avatarUrl ?? null,
      ownerId: team.owner.id,
      role: (membership.role === 'admin' && team.owner.id === userId
        ? 'owner'
        : membership.role) as TeamResponseDto['role'],
      createdAt: team.createdAt.toISOString(),
      updatedAt: team.updatedAt.toISOString(),
    };
  }

  async inviteMember(
    teamId: number,
    dto: InviteMemberDto,
    inviterId: number,
  ): Promise<void> {
    const team = await this.em.findOne(
      Team,
      { id: teamId },
      { populate: ['members', 'owner'] },
    );
    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    const isOwner = team.owner.id === inviterId;
    const membership = await this.em.findOne(Membership, {
      user: inviterId,
      team: teamId,
    });

    if (!isOwner && (!membership || membership.role !== 'admin')) {
      throw new NotFoundException(
        'Only team admins or owner can invite members',
      );
    }

    const invitedUser = await this.em.findOne(User, { email: dto.email });
    if (!invitedUser) {
      throw new NotFoundException(`User with email ${dto.email} not found`);
    }

    const existing = await this.em.findOne(Membership, {
      user: invitedUser.id,
      team: teamId,
    });
    if (existing) {
      throw new NotFoundException('User is already a member of this team');
    }

    // Enforce Business plan for collaboration features
    await this.assertBusinessPlanForTeam(team);

    this.em.create(Membership, {
      user: invitedUser,
      team,
      role: dto.role,
      joinedAt: new Date(),
    });

    await this.em.flush();
  }

  async updateMemberRole(
    teamId: number,
    memberId: number,
    dto: UpdateMemberRoleDto,
    updaterId: number,
  ): Promise<void> {
    const team = await this.em.findOne(
      Team,
      { id: teamId },
      { populate: ['owner'] },
    );
    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    const isOwner = team.owner.id === updaterId;
    const updaterMembership = await this.em.findOne(Membership, {
      user: updaterId,
      team: teamId,
    });

    if (
      !isOwner &&
      (!updaterMembership || updaterMembership.role !== 'admin')
    ) {
      throw new NotFoundException('Only team admins or owner can update roles');
    }

    const membership = await this.em.findOne(Membership, {
      user: memberId,
      team: teamId,
    });

    if (!membership) {
      throw new NotFoundException(`User is not a member of this team`);
    }

    await this.assertBusinessPlanForTeam(team);
    membership.role = dto.role;
    await this.em.flush();
  }

  async removeMember(
    teamId: number,
    memberId: number,
    removerId: number,
  ): Promise<void> {
    const team = await this.em.findOne(
      Team,
      { id: teamId },
      { populate: ['owner'] },
    );
    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    const isOwner = team.owner.id === removerId;
    const removerMembership = await this.em.findOne(Membership, {
      user: removerId,
      team: teamId,
    });

    if (
      !isOwner &&
      (!removerMembership || removerMembership.role !== 'admin')
    ) {
      throw new NotFoundException(
        'Only team admins or owner can remove members',
      );
    }

    const membership = await this.em.findOne(Membership, {
      user: memberId,
      team: teamId,
    });

    if (!membership) {
      throw new NotFoundException(`User is not a member of this team`);
    }

    await this.assertBusinessPlanForTeam(team);
    await this.em.removeAndFlush(membership);
  }

  async leaveTeam(teamId: number, userId: number): Promise<void> {
    const membership = await this.em.findOne(Membership, {
      user: userId,
      team: teamId,
      leftAt: null,
    });
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    if (membership.role === 'owner') {
      throw new ForbiddenException('Owner cannot leave their own team');
    }

    membership.leftAt = new Date();
    await this.em.flush();
  }

  async deleteTeam(teamId: number, ownerId: number): Promise<void> {
    const team = await this.em.findOne(
      Team,
      { id: teamId },
      {
        populate: ['owner'],
      },
    );
    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }
    if (team.owner.id !== ownerId) {
      throw new ForbiddenException('Only the owner can delete the team');
    }

    team.deletedAt = new Date();
    await this.em.flush();
  }

  async updateAvatarUrl(
    teamId: number,
    ownerId: number,
    avatarUrl: string | null,
  ): Promise<TeamResponseDto> {
    const team = await this.em.findOne(
      Team,
      { id: teamId },
      { populate: ['owner'] },
    );
    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }
    if (team.owner.id !== ownerId) {
      throw new ForbiddenException('Only the owner can update team avatar');
    }

    team.avatarUrl = avatarUrl ?? undefined;
    await this.em.flush();

    return {
      id: team.id,
      name: team.name,
      description: team.description ?? null,
      avatarUrl: team.avatarUrl ?? null,
      ownerId: team.owner.id,
      role: 'owner',
      createdAt: team.createdAt.toISOString(),
      updatedAt: team.updatedAt.toISOString(),
    };
  }

  async uploadAvatarFromFile(
    teamId: number,
    ownerId: number,
    file: { path?: string; buffer?: Buffer },
  ): Promise<TeamResponseDto> {
    if (!file?.path && !file?.buffer) {
      throw new BadRequestException('No valid file provided');
    }

    const media = await this.mediaService.upload(file);
    return this.updateAvatarUrl(teamId, ownerId, media.url);
  }

  private async assertAdminOrOwner(
    teamId: number,
    userId: number,
  ): Promise<{ team: Team }> {
    const team = await this.em.findOne(
      Team,
      { id: teamId },
      { populate: ['owner'] },
    );
    if (!team) throw new NotFoundException(`Team with ID ${teamId} not found`);

    const isOwner = team.owner.id === userId;
    const membership = await this.em.findOne(Membership, {
      user: userId,
      team: teamId,
    });
    const isAdmin = membership?.role === 'admin';
    if (!isOwner && !isAdmin)
      throw new ForbiddenException('Requires admin or owner');
    return { team };
  }

  async approvePost(
    teamId: number,
    postId: number,
    approverId: number,
  ): Promise<void> {
    await this.assertAdminOrOwner(teamId, approverId);
    const { team } = await this.getTeamWithOwner(teamId);
    await this.assertBusinessPlanForTeam(team);
    const post = await this.em.findOne(Post, { id: postId, team: teamId });
    if (!post) throw new NotFoundException('Post not found');
    post.status = 'scheduled';
    await this.em.persistAndFlush(post);
    this.em.persist(
      this.em.create(AuditLog, {
        user: this.em.getReference(User, approverId),
        action: 'post.approved',
        entityType: 'post',
        entityId: String(postId),
        createdAt: new Date(),
      }),
    );
    await this.em.flush();
  }

  async rejectPost(
    teamId: number,
    postId: number,
    approverId: number,
  ): Promise<void> {
    await this.assertAdminOrOwner(teamId, approverId);
    const { team } = await this.getTeamWithOwner(teamId);
    await this.assertBusinessPlanForTeam(team);
    const post = await this.em.findOne(Post, { id: postId, team: teamId });
    if (!post) throw new NotFoundException('Post not found');
    post.status = 'draft';
    await this.em.persistAndFlush(post);
    this.em.persist(
      this.em.create(AuditLog, {
        user: this.em.getReference(User, approverId),
        action: 'post.rejected',
        entityType: 'post',
        entityId: String(postId),
        createdAt: new Date(),
      }),
    );
    await this.em.flush();
  }

  async listAuditLogs(
    teamId: number,
    userId: number,
  ): Promise<
    Array<{
      id: number;
      action: string;
      entityType?: string;
      entityId?: string;
      createdAt: Date;
    }>
  > {
    await this.assertAdminOrOwner(teamId, userId);
    const { team } = await this.getTeamWithOwner(teamId);
    await this.assertBusinessPlanForTeam(team);
    // Fetch recent logs and filter by team: include
    // - post.* logs where the post belongs to this team
    // - team.* logs where entityId == teamId
    const logs = await this.em.find(
      AuditLog,
      {},
      { orderBy: { createdAt: 'DESC' }, limit: 200 },
    );

    const postIds = logs
      .filter(
        (l) =>
          l.entityType === 'post' && !!l.entityId && /^\d+$/.test(l.entityId),
      )
      .map((l) => Number(l.entityId));

    const teamPosts = postIds.length
      ? await this.em.find(
          Post,
          { id: { $in: postIds }, team: teamId },
          { fields: ['id'] },
        )
      : [];
    const allowedPostIds = new Set(teamPosts.map((p) => p.id));

    const filtered = logs.filter(
      (l) =>
        (l.entityType === 'post' &&
          !!l.entityId &&
          allowedPostIds.has(Number(l.entityId))) ||
        (l.entityType === 'team' && l.entityId === String(teamId)),
    );

    return filtered.map((l) => ({
      id: l.id,
      action: l.action,
      entityType: l.entityType,
      entityId: l.entityId,
      createdAt: l.createdAt,
    }));
  }

  private async getTeamWithOwner(teamId: number): Promise<{ team: Team }> {
    const team = await this.em.findOne(
      Team,
      { id: teamId },
      { populate: ['owner'] },
    );
    if (!team) throw new NotFoundException(`Team with ID ${teamId} not found`);
    return { team };
  }

  private async assertBusinessPlanForTeam(team: Team): Promise<void> {
    // Check the team owner's active subscription and require Business plan
    const now = new Date();
    const sub = await this.em.findOne(
      Subscription,
      {
        user: team.owner.id,
        status: { $in: ['active', 'trialing'] },
        periodStartsAt: { $lte: now },
        periodEndsAt: { $gte: now },
      },
      { populate: ['plan'] },
    );
    if (!sub || !sub.plan || (sub.plan as Plan).name !== 'Business') {
      throw new ForbiddenException('Business plan required for team features');
    }
  }
}
