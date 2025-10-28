import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { Team } from 'src/entities/team.entity';
import { SocialAccount } from 'src/entities/social-account.entity';
import { Campaign } from 'src/entities/campaign.entity';
import { Template } from 'src/entities/template.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BulkCreatePostsDto } from './dto/bulk-create-posts.dto';
import { RecurringPostDto } from './dto/recurring-post.dto';
import { DraftPostDto } from './dto/draft-post.dto';
import { Job } from 'src/entities/job.entity';
import { PostTarget } from 'src/entities/post-target.entity';

@Injectable()
export class PostsService {
  constructor(private readonly em: EntityManager) { }

  async findAll(): Promise<Post[]> {
    const posts = await this.em.find(Post, { deletedAt: null });
    return posts;
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    // Extract and remove relational IDs from DTO
    const {
      authorId,
      teamId,
      socialAccountIds,
      campaignId,
      templateId,
      ...data
    } = createPostDto;
    // Validate required relations
    if (!authorId) {
      throw new NotFoundException('Author ID is required');
    }
    if (!socialAccountIds || socialAccountIds.length === 0) {
      throw new BadRequestException('At least one socialAccountId is required');
    }

    // Fetch related entities in parallel
    const [author, team, campaign, template] = await Promise.all([
      this.em.findOne(User, { id: authorId }),
      teamId ? this.em.findOne(Team, { id: teamId }) : undefined,
      campaignId ? this.em.findOne(Campaign, { id: campaignId }) : undefined,
      templateId ? this.em.findOne(Template, { id: templateId }) : undefined,
    ]);

    if (!author) {
      throw new NotFoundException(`Author with ID "${authorId}" not found`);
    }

    // Validate and parse scheduleAt
    const now = new Date();
    const scheduleAtDate = new Date(data.scheduleAt);
    if (Number.isNaN(scheduleAtDate.getTime())) {
      throw new BadRequestException('Invalid scheduleAt');
    }

    // Create the Post entity
    const post = this.em.create(Post, {
      ...data,
      author,
      team,
      campaign,
      template,
      scheduleAt: scheduleAtDate,
      status: data.status ?? 'draft',
      isRecurring: data.isRecurring ?? false,
      createdAt: now,
      updatedAt: now,
    });

    // Save the Post first to get an ID
    await this.em.persistAndFlush(post);

    // Create PostTargets for each selected social account
    if (socialAccountIds && socialAccountIds.length > 0) {
      const uniqueIds = Array.from(new Set(socialAccountIds));
      const accounts = await this.em.find(SocialAccount, {
        id: { $in: uniqueIds },
      });
      if (accounts.length !== uniqueIds.length) {
        throw new NotFoundException('One or more socialAccountIds are invalid');
      }
      for (const acc of accounts) {
        const target = this.em.create(PostTarget, {
          post,
          socialAccount: acc,
          status: post.status === 'scheduled' ? 'scheduled' : 'pending',
          scheduledAt:
            post.status === 'scheduled' ? post.scheduleAt : undefined,
          attempt: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        this.em.persist(target);
      }
      // Save all PostTargets
      await this.em.flush();

      // If post is scheduled, create jobs for each target now
      if (post.status === 'scheduled') {
        const targets = await this.em.find(PostTarget, { post: post.id });
        for (const t of targets) {
          const job = this.em.create(Job, {
            post,
            target: t,
            provider: t.socialAccount.provider,
            attempt: 0,
            status: 'pending',
            scheduledAt: post.scheduleAt,
          });
          this.em.persist(job);
        }
        await this.em.flush();
      }
    }
    return post;
  }

  async bulkCreate(dto: BulkCreatePostsDto): Promise<Post[]> {
    const results: Post[] = [];
    for (const item of dto.posts) {
      const p = await this.create(item);
      results.push(p);
    }
    return results;
  }

  async createRecurring(dto: RecurringPostDto): Promise<Post> {
    return await this.create({ ...dto, isRecurring: true });
  }

  async createDraft(dto: DraftPostDto): Promise<Post> {
    return await this.create({ ...dto });
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.em.findOne(Post, { id });
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }

    const { teamId, socialAccountIds, campaignId, templateId, ...updateData } =
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
      const dt = new Date(updateData.scheduleAt);
      if (Number.isNaN(dt.getTime())) {
        throw new BadRequestException('Invalid scheduleAt');
      }
      post.scheduleAt = dt;
    }

    // ✅ Update relationships: use `?? undefined` to convert `null` → `undefined`
    if (teamId !== undefined) {
      post.team = teamId
        ? ((await this.em.findOne(Team, { id: teamId })) ?? undefined)
        : undefined;
    }

    if (socialAccountIds !== undefined) {
      // Replace existing targets with this new set
      const existing = await this.em.find(PostTarget, { post: post.id });
      existing.forEach((t) => this.em.remove(t));
      if (socialAccountIds && socialAccountIds.length > 0) {
        const uniqueIds = Array.from(new Set(socialAccountIds));
        const accounts = await this.em.find(SocialAccount, {
          id: { $in: uniqueIds },
        });
        if (accounts.length !== uniqueIds.length) {
          throw new NotFoundException(
            'One or more socialAccountIds are invalid',
          );
        }
        for (const acc of accounts) {
          const target = this.em.create(PostTarget, {
            post,
            socialAccount: acc,
            status: post.status === 'scheduled' ? 'scheduled' : 'pending',
            scheduledAt:
              post.status === 'scheduled' ? post.scheduleAt : undefined,
            attempt: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          this.em.persist(target);
        }
      }
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

    // If post is scheduled, ensure jobs exist for each target
    if (post.status === 'scheduled') {
      const targets = await this.em.find(PostTarget, { post: post.id });
      for (const t of targets) {
        // Try to find an existing pending/failed job for this target
        const jobs = await this.em.find(Job, { target: t.id });
        const job = jobs[0];
        if (job) {
          job.status = 'pending';
          job.attempt = 0;
          job.scheduledAt = post.scheduleAt;
        } else {
          const newJob = this.em.create(Job, {
            post,
            target: t,
            provider: t.socialAccount.provider,
            attempt: 0,
            status: 'pending',
            scheduledAt: post.scheduleAt,
          });
          this.em.persist(newJob);
        }
      }
      await this.em.flush();
    }
    return post;
  }

  async reschedule(id: number, scheduleAt: string): Promise<Post> {
    const post = await this.em.findOne(Post, { id });
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    const newDt = new Date(scheduleAt);
    if (Number.isNaN(newDt.getTime())) {
      throw new BadRequestException('Invalid scheduleAt');
    }
    post.scheduleAt = newDt;
    post.status = 'scheduled';
    // Update targets and (re)create or reschedule jobs for not-yet-success targets
    const targets = await this.em.find(PostTarget, { post: post.id });
    for (const t of targets) {
      if (t.status !== 'success') {
        t.status = 'scheduled';
        t.scheduledAt = newDt;
        // Find existing job for this target or create one
        const jobs = await this.em.find(Job, { target: t.id });
        const job = jobs[0];
        if (job) {
          job.status = 'pending';
          job.attempt = 0;
          job.scheduledAt = newDt;
        } else {
          const newJob = this.em.create(Job, {
            post,
            target: t,
            provider: t.socialAccount.provider,
            attempt: 0,
            status: 'pending',
            scheduledAt: newDt,
          });
          this.em.persist(newJob);
        }
      }
    }
    await this.em.flush();
    return post;
  }

  async publishNow(id: number): Promise<Post> {
    const post = await this.em.findOne(Post, { id });
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    // Enqueue a job for immediate publishing; provider inferred from socialAccount
    // Enqueue a job per target (skip targets already successful)
    const targets = await this.em.find(
      PostTarget,
      { post: post.id },
      { populate: ['socialAccount'] },
    );
    for (const t of targets) {
      if (t.status === 'success') continue;
      const job = this.em.create(Job, {
        post,
        target: t,
        provider: t.socialAccount.provider,
        attempt: 0,
        status: 'pending',
        scheduledAt: new Date(),
      });
      this.em.persist(job);
      t.status = 'scheduled';
      t.scheduledAt = job.scheduledAt;
    }
    post.status = 'scheduled';
    post.publishedAt = undefined;
    await this.em.flush();
    return post;
  }

  async getStatus(id: number): Promise<{
    id: number;
    status: Post['status'];
    scheduledAt: Date;
    publishedAt?: Date;
  }> {
    const post = await this.em.findOne(Post, { id });
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    return {
      id: post.id,
      status: post.status,
      scheduledAt: post.scheduleAt,
      publishedAt: post.publishedAt,
    };
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
