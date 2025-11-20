import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TagsService } from './tags.service';
import {
  TagResponseDto,
  CreateTagDto,
  UpdateTagDto,
  GetOrCreateTagDto,
} from './dto/tag.dto';
import { ApiStandardErrors } from 'src/common/decorators/api-standard-errors.decorator';
import { Tag } from '../entities/tag.entity';
import { Logger } from '@nestjs/common';

const logger = new Logger('TagsController');

@ApiStandardErrors()
@ApiTags('Tags')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  private toDto(t: Tag): TagResponseDto {
    return {
      id: t.id,
      name: t.name,
      normalized: t.normalized,
      ownerId: t.owner.id,
      metadata: t.metadata ?? null,
      createdAt: t.createdAt.toISOString(),
    };
  }

  /* --------------------------------------
   * LIST TAGS
   * -------------------------------------- */
  @Get()
  @ApiOperation({ summary: 'List tags for current user (paginated)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({ status: 200, type: [TagResponseDto] })
  async findAll(
    @Req() req: { user: { id: number } },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ): Promise<TagResponseDto[]> {
    const ownerId = req.user.id;
    const pageNum = page ? parseInt(page, 10) || 1 : 1;
    const limitNum = limit ? parseInt(limit, 10) || 20 : 20;

    logger.log(
      `Listing tags for ownerId=${ownerId}, page=${pageNum}, limit=${limitNum}, search=${search}`,
    );

    const tags = await this.tagsService.findAll(
      ownerId,
      pageNum,
      limitNum,
      search,
    );

    return tags.map((t) => this.toDto(t));
  }

  /* --------------------------------------
   * GET ONE TAG
   * -------------------------------------- */
  @Get(':id')
  @ApiOperation({ summary: 'Get a user-owned tag' })
  @ApiResponse({ status: 200, type: TagResponseDto })
  async findOne(
    @Req() req: { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TagResponseDto> {
    const t = await this.tagsService.findOne(id, req.user.id);
    return this.toDto(t);
  }

  /* --------------------------------------
   * CREATE TAG
   * -------------------------------------- */
  @Post()
  @ApiOperation({ summary: 'Create a new tag for current user' })
  @ApiResponse({ status: 201, type: TagResponseDto })
  async create(
    @Req() req: { user: { id: number } },
    @Body() dto: CreateTagDto,
  ): Promise<TagResponseDto> {
    const tag = await this.tagsService.create(req.user.id, dto);
    return this.toDto(tag);
  }

  /* --------------------------------------
   * UPDATE TAG  (🔥 NEW)
   * -------------------------------------- */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a tag (name or metadata)' })
  @ApiResponse({ status: 200, type: TagResponseDto })
  async update(
    @Req() req: { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTagDto,
  ): Promise<TagResponseDto> {
    const tag = await this.tagsService.update(id, req.user.id, dto);
    return this.toDto(tag);
  }

  /* --------------------------------------
   * GET OR CREATE TAG (🔥 NEW)
   * -------------------------------------- */
  @Post('get-or-create')
  @ApiOperation({ summary: 'Get an existing tag or create it if missing' })
  @ApiResponse({ status: 200, type: TagResponseDto })
  async getOrCreate(
    @Req() req: { user: { id: number } },
    @Body() dto: GetOrCreateTagDto,
  ): Promise<TagResponseDto> {
    const tag = await this.tagsService.getOrCreate(req.user.id, dto.name);
    return this.toDto(tag);
  }

  /* --------------------------------------
   * DELETE TAG
   * -------------------------------------- */
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a user-owned tag' })
  async remove(
    @Req() req: { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.tagsService.remove(id, req.user.id);
  }
}
