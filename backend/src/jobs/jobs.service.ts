import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Job } from '../entities/job.entity';
import { JobResponseDto, PaginatedJobsDto } from './dto/job-response.dto';

interface FindAllJobsOptions {
  status?: Job['status'];
  postId?: number;
  page: number;
  limit: number;
}

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: EntityRepository<Job>,
    private readonly em: EntityManager,
  ) {}

  private toDto(job: Job): JobResponseDto {
    return {
      id: job.id,
      postId: job.post.id,
      targetId: job.target ? job.target.id : null,
      provider: job.provider,
      status: job.status,
      lastError: job.lastError ?? null,
      attempt: job.attempt,
      scheduledAt: job.scheduledAt.toISOString(),
      executedAt: job.executedAt ? job.executedAt.toISOString() : null,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
    };
  }

  async findAll(options: FindAllJobsOptions): Promise<PaginatedJobsDto> {
    const { status, postId, page, limit } = options;
    const where: Record<string, any> = {};
    if (status) where.status = status;
    if (postId) where.post = postId;

    const [jobs, total] = await this.jobRepository.findAndCount(where, {
      populate: ['post', 'target'],
      limit,
      offset: (page - 1) * limit,
      orderBy: { createdAt: 'DESC' },
    });

    const pages = Math.ceil(total / limit) || 1;

    return {
      data: jobs.map((job) => this.toDto(job)),
      meta: {
        total,
        page,
        limit,
        pages,
      },
    };
  }

  async findOne(id: number): Promise<JobResponseDto> {
    const job = await this.jobRepository.findOne(id, {
      populate: ['post', 'target'],
    });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return this.toDto(job);
  }

  async retry(id: number): Promise<JobResponseDto> {
    const job = await this.jobRepository.findOne(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    if (job.status !== 'failed') {
      throw new BadRequestException('Only failed jobs can be retried');
    }

    job.status = 'pending';
    job.attempt = 0;
    job.lastError = undefined;
    job.scheduledAt = new Date();
    job.executedAt = undefined;

    await this.em.flush();
    return this.toDto(job);
  }

  async cancel(id: number): Promise<JobResponseDto> {
    const job = await this.jobRepository.findOne(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    if (job.status !== 'pending' && job.status !== 'processing') {
      throw new BadRequestException(
        'Only pending or processing jobs can be cancelled',
      );
    }

    job.status = 'failed';
    job.lastError = 'Cancelled by user';
    job.executedAt = new Date();

    await this.em.flush();
    return this.toDto(job);
  }
}
