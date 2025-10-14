import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Delete,
  ParseIntPipe,
  Get,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from '../entities/post.entity';
import { BulkCreatePostsDto } from './dto/bulk-create-posts.dto';
import { RecurringPostDto } from './dto/recurring-post.dto';
import { DraftPostDto } from './dto/draft-post.dto';
import { ReschedulePostDto } from './dto/reschedule-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
interface UploadedFileLike {
  buffer?: Buffer;
}
import { parse as parseCsv } from 'csv-parse/sync';
import {
  PostResponseDto,
  PostStatusResponseDto,
} from './dto/post-response.dto';

@ApiTags('Posts')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  private toDto(p: PostEntity): PostResponseDto {
    return {
      id: p.id,
      contentAr: p.contentAr,
      contentEn: p.contentEn,
      status: p.status,
      isRecurring: p.isRecurring,
      publishedAt: p.publishedAt ?? null,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      scheduleAt: p.scheduleAt,
    };
  }

  // endpoint to create
  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Related entity not found' })
  @ApiBody({ type: CreatePostDto })
  async create(@Body() createPostDto: CreatePostDto) {
    const post = await this.postsService.create(createPostDto);
    return this.toDto(post);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create posts' })
  @ApiResponse({
    status: 201,
    description: 'Posts created',
    type: [PostResponseDto],
  })
  async bulkCreate(@Body() dto: BulkCreatePostsDto) {
    const posts = await this.postsService.bulkCreate(dto);
    return posts.map((p) => this.toDto(p));
  }

  @Post('bulk/csv')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Bulk create posts from CSV upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description:
            'CSV with headers: contentAr,contentEn?,scheduleAt,authorId,teamId?,socialAccountIds?(comma-separated),campaignId?,templateId?,status?,isRecurring?',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Posts created from CSV',
    type: [PostResponseDto],
  })
  async bulkCreateFromCsv(@UploadedFile() file: UploadedFileLike | undefined) {
    if (!file?.buffer) {
      return [];
    }
    const text = file.buffer.toString('utf8');
    const records = parseCsv(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const allowedStatuses = new Set([
      'draft',
      'scheduled',
      'published',
      'failed',
      'pending_approval',
    ]);

    const posts: CreatePostDto[] = records.map((r) => {
      const statusStr = r.status?.toString();
      let status: CreatePostDto['status'] | undefined;
      if (statusStr && allowedStatuses.has(statusStr)) {
        status = statusStr as CreatePostDto['status'];
      }
      const obj: CreatePostDto = {
        contentAr: String(r.contentAr ?? ''),
        contentEn: r.contentEn ? String(r.contentEn) : undefined,
        scheduleAt: String(r.scheduleAt),
        status,
        isRecurring: r.isRecurring ? r.isRecurring === 'true' : undefined,
        authorId: Number(r.authorId),
        teamId: r.teamId ? Number(r.teamId) : undefined,
        socialAccountIds: r.socialAccountIds
          ? String(r.socialAccountIds)
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
              .map((s) => Number(s))
              .filter((n) => !Number.isNaN(n))
          : undefined,
        campaignId: r.campaignId ? Number(r.campaignId) : undefined,
        templateId: r.templateId ? Number(r.templateId) : undefined,
      };
      return obj;
    });

    const created = await this.postsService.bulkCreate({ posts });
    return created.map((p) => this.toDto(p));
  }

  @Post('recurring')
  @ApiOperation({ summary: 'Create a recurring post' })
  @ApiResponse({
    status: 201,
    description: 'Recurring post created',
    type: PostResponseDto,
  })
  async createRecurring(@Body() dto: RecurringPostDto) {
    const p = await this.postsService.createRecurring(dto);
    return this.toDto(p);
  }

  @Post('draft')
  @ApiOperation({ summary: 'Create a draft post' })
  @ApiResponse({
    status: 201,
    description: 'Draft post created',
    type: PostResponseDto,
  })
  async createDraft(@Body() dto: DraftPostDto) {
    const p = await this.postsService.createDraft(dto);
    return this.toDto(p);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing post' })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const p = await this.postsService.update(id, updatePostDto);
    return this.toDto(p);
  }

  @Put(':id/reschedule')
  @ApiOperation({ summary: 'Reschedule a post' })
  @ApiResponse({
    status: 200,
    description: 'Post rescheduled',
    type: PostResponseDto,
  })
  async reschedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReschedulePostDto,
  ) {
    const p = await this.postsService.reschedule(id, dto.scheduleAt);
    return this.toDto(p);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish a post immediately (enqueue job)' })
  @ApiResponse({
    status: 200,
    description: 'Publish job enqueued',
    type: PostResponseDto,
  })
  async publishNow(@Param('id', ParseIntPipe) id: number) {
    const p = await this.postsService.publishNow(id);
    return this.toDto(p);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get post status' })
  @ApiResponse({
    status: 200,
    description: 'Status fetched',
    type: PostStatusResponseDto,
  })
  async statusGet(@Param('id', ParseIntPipe) id: number) {
    const s = await this.postsService.getStatus(id);
    return s as PostStatusResponseDto;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post (soft delete)' })
  @ApiResponse({ status: 200, description: 'Post marked as deleted' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.postsService.remove(id);
  }
}
