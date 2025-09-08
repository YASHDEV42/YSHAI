// teams/teams.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Team } from 'src/entities/team.entity';
import { User } from 'src/entities/user.entity';
import { Membership } from 'src/entities/membership.entity';
import { Post } from 'src/entities/post.entity';
import { AuditLog } from 'src/entities/audit-log.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

@Injectable()
export class TeamsService {
  constructor(private readonly em: EntityManager) {}

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

  async inviteMember(
    teamId: number,
    dto: InviteMemberDto,
    inviterId: number,
  ): Promise<void> {
    const team = await this.em.findOne(
      Team,
      { id: teamId },
      { populate: ['memberships', 'owner'] },
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

    await this.em.removeAndFlush(membership);
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
        timestamp: new Date(),
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
        timestamp: new Date(),
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
      timestamp: Date;
    }>
  > {
    await this.assertAdminOrOwner(teamId, userId);
    // Fetch recent logs and filter by team: include
    // - post.* logs where the post belongs to this team
    // - team.* logs where entityId == teamId
    const logs = await this.em.find(
      AuditLog,
      {},
      { orderBy: { timestamp: 'DESC' }, limit: 200 },
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
      timestamp: l.timestamp,
    }));
  }
}
