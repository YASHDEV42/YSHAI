import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Campaign } from '../entities/campaign.entity';
import { User } from '../entities/user.entity';
import { Team } from '../entities/team.entity';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(private readonly em: EntityManager) {}

  async findAll(ownerId: number): Promise<Campaign[]> {
    return await this.em.find(
      Campaign,
      { owner: ownerId, deletedAt: null },
      { orderBy: { createdAt: 'DESC' } },
    );
  }

  async findOne(id: number, ownerId: number): Promise<Campaign> {
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

  async create(
    ownerId: number,
    teamId: number | undefined,
    dto: CreateCampaignDto,
  ): Promise<Campaign> {
    const owner = await this.em.findOne(User, { id: ownerId });
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const team = teamId
      ? await this.em.findOne(Team, { id: teamId })
      : undefined;

    const campaign = this.em.create(Campaign, {
      name: dto.name,
      description: dto.description,
      owner,
      team,
      status: dto.status ?? 'draft',
      startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
      endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
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
    const campaign = await this.em.findOne(Campaign, {
      id,
      owner: ownerId,
      deletedAt: null,
    });
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID "${id}" not found`);
    }

    if (dto.name !== undefined) campaign.name = dto.name;
    if (dto.description !== undefined)
      campaign.description = dto.description ?? undefined;
    if (dto.status !== undefined) campaign.status = dto.status;
    if (dto.startsAt !== undefined)
      campaign.startsAt = dto.startsAt ? new Date(dto.startsAt) : undefined;
    if (dto.endsAt !== undefined)
      campaign.endsAt = dto.endsAt ? new Date(dto.endsAt) : undefined;

    campaign.updatedAt = new Date();
    await this.em.flush();
    return campaign;
  }

  async remove(id: number, ownerId: number): Promise<void> {
    const campaign = await this.em.findOne(Campaign, {
      id,
      owner: ownerId,
      deletedAt: null,
    });
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID "${id}" not found`);
    }
    campaign.deletedAt = new Date();
    await this.em.flush();
  }
}
