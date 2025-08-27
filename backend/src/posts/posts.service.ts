// src/posts/posts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { Team } from 'src/entities/team.entity';
import { SocialAccount } from 'src/entities/social-account.entity';
import { Campaign } from 'src/entities/campaign.entity';
import { Template } from 'src/entities/template.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly em: EntityManager) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const {
      authorId,
      teamId,
      socialAccountId,
      campaignId,
      templateId,
      ...data
    } = createPostDto;

    if (!authorId) {
      throw new NotFoundException('Author ID is required');
    }

    const [author, team, socialAccount, campaign, template] = await Promise.all(
      [
        this.em.findOne(User, { id: authorId }),
        teamId ? this.em.findOne(Team, { id: teamId }) : undefined,
        socialAccountId
          ? this.em.findOne(SocialAccount, { id: socialAccountId })
          : undefined,
        campaignId ? this.em.findOne(Campaign, { id: campaignId }) : undefined,
        templateId ? this.em.findOne(Template, { id: templateId }) : undefined,
      ],
    );

    if (!author) {
      throw new NotFoundException(`Author with ID "${authorId}" not found`);
    }

    const now = new Date();

    const post = this.em.create(Post, {
      ...data,
      author,
      team,
      socialAccount,
      campaign,
      template,
      scheduleAt: new Date(data.scheduleAt),
      status: data.status ?? 'draft',
      isRecurring: data.isRecurring ?? false,
      createdAt: now,
      updatedAt: now,
    });

    await this.em.persistAndFlush(post);
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.em.findOne(Post, { id });
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }

    const { teamId, socialAccountId, campaignId, templateId, ...updateData } =
      updatePostDto;

    // Update scalar fields
    if (updateData.contentAr !== undefined)
      post.contentAr = updateData.contentAr;
    if (updateData.contentEn !== undefined)
      post.contentEn = updateData.contentEn;
    if (updateData.status !== undefined) post.status = updateData.status;
    if (updateData.isRecurring !== undefined)
      post.isRecurring = updateData.isRecurring;
    if (updateData.scheduleAt !== undefined) {
      post.scheduleAt = new Date(updateData.scheduleAt);
    }

    // ✅ Update relationships: use `?? undefined` to convert `null` → `undefined`
    if (teamId !== undefined) {
      post.team = teamId
        ? ((await this.em.findOne(Team, { id: teamId })) ?? undefined)
        : undefined;
    }

    if (socialAccountId !== undefined) {
      post.socialAccount = socialAccountId
        ? ((await this.em.findOne(SocialAccount, { id: socialAccountId })) ??
          undefined)
        : undefined;
    }

    if (campaignId !== undefined) {
      post.campaign = campaignId
        ? ((await this.em.findOne(Campaign, { id: campaignId })) ?? undefined)
        : undefined;
    }

    if (templateId !== undefined) {
      post.template = templateId
        ? ((await this.em.findOne(Template, { id: templateId })) ?? undefined)
        : undefined;
    }

    await this.em.flush();
    return post;
  }

  async remove(id: number): Promise<void> {
    const post = await this.em.findOne(Post, { id });
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }

    post.deletedAt = new Date();
    await this.em.flush();
  }
}
