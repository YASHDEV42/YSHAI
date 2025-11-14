import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Template } from '../entities/template.entity';
import { User } from '../entities/user.entity';
import { Team } from '../entities/team.entity';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/template.dto';

@Injectable()
export class TemplatesService {
  constructor(private readonly em: EntityManager) {}

  async findAll(ownerId: number): Promise<Template[]> {
    return await this.em.find(
      Template,
      { owner: ownerId, deletedAt: null },
      { orderBy: { createdAt: 'DESC' } },
    );
  }

  async findOne(id: number, ownerId: number): Promise<Template> {
    const template = await this.em.findOne(Template, {
      id,
      owner: ownerId,
      deletedAt: null,
    });
    if (!template) {
      throw new NotFoundException(`Template with ID "${id}" not found`);
    }
    return template;
  }

  async create(
    ownerId: number,
    teamId: number | undefined,
    dto: CreateTemplateDto,
  ): Promise<Template> {
    const owner = await this.em.findOne(User, { id: ownerId });
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const team = teamId
      ? await this.em.findOne(Team, { id: teamId })
      : undefined;

    const template = this.em.create(Template, {
      name: dto.name,
      contentAr: dto.contentAr,
      contentEn: dto.contentEn,
      description: dto.description,
      owner,
      team,
      visibility: dto.visibility ?? 'private',
      language: dto.language,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.em.persistAndFlush(template);
    return template;
  }

  async update(
    id: number,
    ownerId: number,
    dto: UpdateTemplateDto,
  ): Promise<Template> {
    const template = await this.em.findOne(Template, {
      id,
      owner: ownerId,
      deletedAt: null,
    });
    if (!template) {
      throw new NotFoundException(`Template with ID "${id}" not found`);
    }

    if (dto.name !== undefined) template.name = dto.name;
    if (dto.contentAr !== undefined) template.contentAr = dto.contentAr;
    if (dto.contentEn !== undefined)
      template.contentEn = dto.contentEn ?? undefined;
    if (dto.description !== undefined)
      template.description = dto.description ?? undefined;
    if (dto.visibility !== undefined) template.visibility = dto.visibility;
    if (dto.language !== undefined)
      template.language = dto.language ?? undefined;

    template.updatedAt = new Date();
    await this.em.flush();
    return template;
  }

  async remove(id: number, ownerId: number): Promise<void> {
    const template = await this.em.findOne(Template, {
      id,
      owner: ownerId,
      deletedAt: null,
    });
    if (!template) {
      throw new NotFoundException(`Template with ID "${id}" not found`);
    }
    template.deletedAt = new Date();
    await this.em.flush();
  }
}
