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
  ApiBearerAuth,
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

@ApiTags('Posts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: PostEntity,
  })
  @ApiResponse({ status: 404, description: 'Related entity not found' })
  @ApiBody({ type: CreatePostDto })
  async create(@Body() createPostDto: CreatePostDto) {
    const post = await this.postsService.create(createPostDto);
    return post;
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create posts' })
  @ApiResponse({
    status: 201,
    description: 'Posts created',
    type: [PostEntity],
  })
  async bulkCreate(@Body() dto: BulkCreatePostsDto) {
    return await this.postsService.bulkCreate(dto);
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
    type: [PostEntity],
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

    return this.postsService.bulkCreate({ posts });
  }

  @Post('recurring')
  @ApiOperation({ summary: 'Create a recurring post' })
  @ApiResponse({
    status: 201,
    description: 'Recurring post created',
    type: PostEntity,
  })
  async createRecurring(@Body() dto: RecurringPostDto) {
    return await this.postsService.createRecurring(dto);
  }

  @Post('draft')
  @ApiOperation({ summary: 'Create a draft post' })
  @ApiResponse({
    status: 201,
    description: 'Draft post created',
    type: PostEntity,
  })
  async createDraft(@Body() dto: DraftPostDto) {
    return await this.postsService.createDraft(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing post' })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: PostEntity,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postsService.update(id, updatePostDto);
  }

  @Put(':id/reschedule')
  @ApiOperation({ summary: 'Reschedule a post' })
  @ApiResponse({
    status: 200,
    description: 'Post rescheduled',
    type: PostEntity,
  })
  async reschedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReschedulePostDto,
  ) {
    return await this.postsService.reschedule(id, dto.scheduleAt);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish a post immediately (enqueue job)' })
  @ApiResponse({
    status: 200,
    description: 'Publish job enqueued',
    type: PostEntity,
  })
  async publishNow(@Param('id', ParseIntPipe) id: number) {
    return await this.postsService.publishNow(id);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get post status' })
  @ApiResponse({ status: 200, description: 'Status fetched' })
  async statusGet(@Param('id', ParseIntPipe) id: number) {
    return await this.postsService.getStatus(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post (soft delete)' })
  @ApiResponse({ status: 200, description: 'Post marked as deleted' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.postsService.remove(id);
  }
}
