import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Campaign } from '../entities/campaign.entity';
import { User } from '../entities/user.entity';
import { Team } from '../entities/team.entity';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(private readonly em: EntityManager) {}

  /**
   * Normalize pagination values.
   */
  private normalizePagination(page: number, limit: number) {
    const safePage = page < 1 ? 1 : page;
    const safeLimit = Math.min(Math.max(limit, 1), 100); // 1..100
    const offset = (safePage - 1) * safeLimit;

    return { page: safePage, limit: safeLimit, offset };
  }

  /**
   * Validate date range in DTO (startsAt <= endsAt).
   */
  private validateDateRange(
    startsAt?: string | null,
    endsAt?: string | null,
  ): void {
    if (!startsAt || !endsAt) return;

    const start = new Date(startsAt);
    const end = new Date(endsAt);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format for startsAt/endsAt');
    }

    if (start > end) {
      throw new BadRequestException('startsAt cannot be after endsAt');
    }
  }

  /**
   * Ensure we only ever load campaigns the user owns.
   */
  private async getOwnedCampaignOrThrow(
    id: number,
    ownerId: number,
  ): Promise<Campaign> {
    const campaign = await this.em.findOne(Campaign, {
      id,
      owner: ownerId,
      deletedAt: null,
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID "${id}" not found`);
    }

    return campaign;
  }

  /**
   * Ensure team belongs to owner (if teamId is provided).
   * Adjust the "owner" condition according to your Team entity shape.
   */
  private async getOwnedTeamOrThrow(
    teamId: number,
    ownerId: number,
  ): Promise<Team> {
    const team = await this.em.findOne(Team, { id: teamId, owner: ownerId });

    if (!team) {
      throw new BadRequestException(
        'Invalid teamId: team does not exist or does not belong to this user',
      );
    }

    return team;
  }

  async findAll(ownerId: number, page = 1, limit = 20): Promise<Campaign[]> {
    const { offset, limit: safeLimit } = this.normalizePagination(page, limit);

    return await this.em.find(
      Campaign,
      { owner: ownerId, deletedAt: null },
      {
        offset,
        limit: safeLimit,
        orderBy: { createdAt: 'DESC' },
      },
    );
  }

  async findOne(id: number, ownerId: number): Promise<Campaign> {
    return this.getOwnedCampaignOrThrow(id, ownerId);
  }

  async create(
    ownerId: number,
    teamId: number | undefined,
    dto: CreateCampaignDto,
  ): Promise<Campaign> {
    // Validate owner
    const owner = await this.em.findOne(User, { id: ownerId });
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    // Validate/normalize dates
    this.validateDateRange(dto.startsAt ?? null, dto.endsAt ?? null);

    // Validate team if provided (and ensure it belongs to owner)
    let team: Team | undefined;
    if (typeof teamId === 'number') {
      team = await this.getOwnedTeamOrThrow(teamId, ownerId);
    }

    const campaign = this.em.create(Campaign, {
      name: dto.name,
      description: dto.description,
      owner,
      team,
      status: dto.status ?? 'draft',
      startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
      endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      // If your entity uses @OnCreate/@OnUpdate hooks, you can omit these:
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.em.persistAndFlush(campaign);
    return campaign;
  }

  async update(
    id: number,
    ownerId: number,
    dto: UpdateCampaignDto,
  ): Promise<Campaign> {
    const campaign = await this.getOwnedCampaignOrThrow(id, ownerId);

    // Validate date range if one or both are provided
    const startsAtString =
      dto.startsAt !== undefined
        ? dto.startsAt
        : campaign.startsAt?.toISOString();
    const endsAtString =
      dto.endsAt !== undefined ? dto.endsAt : campaign.endsAt?.toISOString();

    this.validateDateRange(startsAtString ?? null, endsAtString ?? null);

    if (dto.name !== undefined) {
      campaign.name = dto.name;
    }

    if (dto.description !== undefined) {
      campaign.description = dto.description ?? undefined;
    }

    if (dto.status !== undefined) {
      campaign.status = dto.status;
    }

    if (dto.startsAt !== undefined) {
      campaign.startsAt = dto.startsAt ? new Date(dto.startsAt) : undefined;
    }

    if (dto.endsAt !== undefined) {
      campaign.endsAt = dto.endsAt ? new Date(dto.endsAt) : undefined;
    }

    campaign.updatedAt = new Date();
    await this.em.flush();
    return campaign;
  }

  async remove(id: number, ownerId: number): Promise<void> {
    const campaign = await this.getOwnedCampaignOrThrow(id, ownerId);
    campaign.deletedAt = new Date();
    await this.em.flush();
  }
}
