import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TagsService } from './tags.service';
import { CreateTagDto, TagResponseDto, UpdatePostTagsDto } from './dto/tag.dto';
import { ApiStandardErrors } from 'src/common/decorators/api-standard-errors.decorator';
@ApiStandardErrors()
@ApiTags('Tags')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('tags')
  @ApiOperation({ summary: 'List all tags (with optional search)' })
  @ApiResponse({ status: 200, type: [TagResponseDto] })
  async findAll(@Query('search') search?: string): Promise<TagResponseDto[]> {
    const tags = await this.tagsService.findAll(search);
    return tags.map((t) => ({
      id: t.id,
      name: t.name,
      normalized: t.normalized,
      metadata: t.metadata ?? null,
      createdAt: t.createdAt.toISOString(), // FIXED: DTO expects string
    }));
  }

  @Post('tags')
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({ status: 201, type: TagResponseDto })
  async create(@Body() dto: CreateTagDto): Promise<TagResponseDto> {
    const t = await this.tagsService.create(dto);
    return {
      id: t.id,
      name: t.name,
      normalized: t.normalized,
      metadata: t.metadata ?? null,
      createdAt: t.createdAt.toISOString(),
    };
  }

  @Get('tags/:id')
  @ApiOperation({ summary: 'Get a single tag' })
  @ApiResponse({ status: 200, type: TagResponseDto })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TagResponseDto> {
    const t = await this.tagsService.findOne(id);
    return {
      id: t.id,
      name: t.name,
      normalized: t.normalized,
      metadata: t.metadata ?? null,
      createdAt: t.createdAt.toISOString(), // FIXED: DTO expects string
    };
  }

  @Delete('tags/:id')
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.tagsService.remove(id);
  }

  @Get('posts/:postId/tags')
  @ApiOperation({ summary: 'List tags for a post' })
  @ApiResponse({ status: 200, type: [TagResponseDto] })
  async getPostTags(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<TagResponseDto[]> {
    const tags = await this.tagsService.getPostTags(postId);
    return tags.map((t) => ({
      id: t.id,
      name: t.name,
      normalized: t.normalized,
      metadata: t.metadata ?? null,
      createdAt: t.createdAt.toISOString(), // FIXED: DTO expects string
    }));
  }

  @Post('posts/:postId/tags')
  @ApiOperation({ summary: 'Replace tags for a post' })
  @ApiResponse({ status: 200, type: [TagResponseDto] })
  async setPostTags(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: UpdatePostTagsDto,
  ): Promise<TagResponseDto[]> {
    const tags = await this.tagsService.setPostTags(postId, dto.names ?? []);
    return tags.map((t) => ({
      id: t.id,
      name: t.name,
      normalized: t.normalized,
      metadata: t.metadata ?? null,
      createdAt: t.createdAt.toISOString(), // FIXED: DTO expects string
    }));
  }
}
