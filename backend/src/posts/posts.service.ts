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
  constructor(private readonly em: EntityManager) {}

  async findAll(filters?: {
    status?: Post['status'];
    teamId?: number;
    campaignId?: number;
    scheduledFrom?: Date;
    scheduledTo?: Date;
  }): Promise<Post[]> {
    const where: Record<string, any> = { deletedAt: null };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.teamId) {
      where.team = filters.teamId;
    }

    if (filters?.campaignId) {
      where.campaign = filters.campaignId;
    }

    if (filters?.scheduledFrom || filters?.scheduledTo) {
      const range: Record<string, Date> = {};
      if (filters.scheduledFrom) {
        range.$gte = filters.scheduledFrom;
      }
      if (filters.scheduledTo) {
        range.$lte = filters.scheduledTo;
      }
      where.scheduledAt = range;
    }

    const posts = await this.em.find(Post, where, {
      populate: ['campaign', 'template', 'targets.socialAccount', 'media'],
    });
    return posts;
  }

  async findOne(id: number): Promise<Post | null> {
    return await this.em.findOne(
      Post,
      { id, deletedAt: null },
      { populate: ['campaign', 'template', 'targets.socialAccount', 'media'] },
    );
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const {
      authorId,
      teamId,
      socialAccountIds,
      campaignId,
      templateId,
      status = 'draft',
      scheduledAt,
      isRecurring = false,
      ...data
    } = createPostDto;

    const now = new Date();

    // 1. BASIC VALIDATION
    if (!authorId) {
      throw new BadRequestException('authorId is required');
    }

    if (!Array.isArray(socialAccountIds) || socialAccountIds.length === 0) {
      throw new BadRequestException('At least one socialAccountId is required');
    }

    // 2. FETCH RELATED ENTITIES (IN PARALLEL)
    const [author, team, campaign, template] = await Promise.all([
      this.em.findOne(User, { id: authorId }),
      teamId ? this.em.findOne(Team, { id: teamId }) : null,
      campaignId ? this.em.findOne(Campaign, { id: campaignId }) : null,
      templateId ? this.em.findOne(Template, { id: templateId }) : null,
    ]);

    if (!author) {
      throw new NotFoundException(`Author with ID "${authorId}" not found`);
    }
    if (teamId && !team) {
      throw new NotFoundException(`Team with ID "${teamId}" not found`);
    }
    if (campaignId && !campaign) {
      throw new NotFoundException(`Campaign with ID "${campaignId}" not found`);
    }
    if (templateId && !template) {
      throw new NotFoundException(`Template with ID "${templateId}" not found`);
    }

    // 3. PARSE & VALIDATE scheduledAt (ONLY FOR SCHEDULED POSTS)
    let scheduledAtDate: Date | null = null;

    if (status === 'scheduled') {
      if (!scheduledAt) {
        throw new BadRequestException(
          'scheduledAt is required for scheduled posts',
        );
      }

      scheduledAtDate = new Date(scheduledAt);

      if (Number.isNaN(scheduledAtDate.getTime())) {
        throw new BadRequestException('Invalid scheduledAt format');
      }

      if (scheduledAtDate < now) {
        throw new BadRequestException('scheduledAt must be a future date');
      }
    }

    // 4. VALIDATE SOCIAL ACCOUNTS + OWNERSHIP
    const uniqueAccountIds = [...new Set(socialAccountIds)];

    const socialAccounts = await this.em.find(SocialAccount, {
      id: { $in: uniqueAccountIds },
    });

    if (socialAccounts.length !== uniqueAccountIds.length) {
      throw new NotFoundException('One or more socialAccountIds are invalid');
    }

    // enforce ownership
    for (const acc of socialAccounts) {
      if (acc.user.id !== authorId) {
        throw new BadRequestException(
          `SocialAccount ${acc.id} does not belong to the author`,
        );
      }
    }

    // 5. CREATE POST ENTITY
    const post = this.em.create(Post, {
      ...data,
      author,
      team,
      campaign,
      template,
      status,
      isRecurring,
      scheduledAt: scheduledAtDate,
      createdAt: now,
      updatedAt: now,
    });

    await this.em.persistAndFlush(post);

    // 6. CREATE POST TARGETS
    const targets: PostTarget[] = [];

    for (const acc of socialAccounts) {
      const target = this.em.create(PostTarget, {
        post,
        socialAccount: acc,
        status: status === 'scheduled' ? 'scheduled' : 'pending',
        scheduledAt: status === 'scheduled' ? scheduledAtDate : null,
        attempt: 0,
        createdAt: now,
        updatedAt: now,
      });

      targets.push(target);
      this.em.persist(target);
    }

    await this.em.flush();

    // 7. CREATE JOBS FOR SCHEDULED POSTS
    if (status === 'scheduled') {
      if (!scheduledAtDate) {
        throw new Error('scheduledAtDate must be defined for scheduled jobs');
      }
      for (const target of targets) {
        const job = this.em.create(Job, {
          post,
          target,
          provider: target.socialAccount.provider,
          attempt: 0,
          status: 'pending',
          scheduledAt: scheduledAtDate,
          createdAt: now,
          updatedAt: now,
        });

        this.em.persist(job);
      }

      await this.em.flush();
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
    const { scheduleAt, ...rest } = dto as unknown as {
      scheduleAt: string;
      [key: string]: any;
    };
    return await this.create({
      ...(rest as Omit<CreatePostDto, 'scheduledAt'>),
      scheduledAt: scheduleAt,
      isRecurring: true,
    });
  }

  async createDraft(dto: DraftPostDto): Promise<Post> {
    const { scheduleAt, ...rest } = dto as unknown as {
      scheduleAt: string;
      [key: string]: any;
    };
    return await this.create({
      ...(rest as Omit<CreatePostDto, 'scheduledAt'>),
      scheduledAt: scheduleAt,
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.em.findOne(Post, { id });
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }

    const {
      teamId,
      socialAccountIds,
      campaignId,
      templateId,
      scheduledAt,
      ...updateData
    } = updatePostDto as UpdatePostDto & { scheduledAt?: string };

    // Update scalar fields
    if (updateData.contentAr !== undefined)
      post.contentAr = updateData.contentAr;
    if (updateData.contentEn !== undefined)
      post.contentEn = updateData.contentEn;
    if (updateData.status !== undefined) post.status = updateData.status;
    if (updateData.isRecurring !== undefined)
      post.isRecurring = updateData.isRecurring;
    if (scheduledAt !== undefined) {
      const dt = new Date(scheduledAt);
      if (Number.isNaN(dt.getTime())) {
        throw new BadRequestException('Invalid scheduledAt');
      }
      post.scheduledAt = dt;
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
              post.status === 'scheduled'
                ? (post.scheduledAt ?? new Date())
                : undefined,
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
          job.scheduledAt = post.scheduledAt ?? new Date();
        } else {
          const newJob = this.em.create(Job, {
            post,
            target: t,
            provider: t.socialAccount.provider,
            attempt: 0,
            status: 'pending',
            scheduledAt: post.scheduledAt ?? new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
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
    post.scheduledAt = newDt;
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
            createdAt: new Date(),
            updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
      scheduledAt: post.scheduledAt ?? new Date(),
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
