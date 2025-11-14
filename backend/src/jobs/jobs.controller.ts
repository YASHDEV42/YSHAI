import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JobsService } from './jobs.service';
import { JobResponseDto, PaginatedJobsDto } from './dto/job-response.dto';
import { ApiStandardErrors } from 'src/common/decorators/api-standard-errors.decorator';
@ApiStandardErrors()
@ApiTags('Jobs')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @ApiOperation({ summary: 'List jobs with optional filters' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['pending', 'processing', 'success', 'failed'],
  })
  @ApiQuery({ name: 'postId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({ type: PaginatedJobsDto })
  async findAll(
    @Query('status') status?: 'pending' | 'processing' | 'success' | 'failed',
    @Query('postId') postId?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ): Promise<PaginatedJobsDto> {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;

    return await this.jobsService.findAll({
      status,
      postId: postId ? parseInt(postId, 10) : undefined,
      page: pageNum,
      limit: limitNum,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single job by id' })
  @ApiOkResponse({ type: JobResponseDto })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<JobResponseDto> {
    return await this.jobsService.findOne(id);
  }

  @Post(':id/retry')
  @ApiOperation({ summary: 'Retry a failed job' })
  @ApiOkResponse({ type: JobResponseDto })
  async retry(@Param('id', ParseIntPipe) id: number): Promise<JobResponseDto> {
    return await this.jobsService.retry(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a pending or processing job' })
  @ApiOkResponse({ type: JobResponseDto })
  async cancel(@Param('id', ParseIntPipe) id: number): Promise<JobResponseDto> {
    return await this.jobsService.cancel(id);
  }
}
