import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TemplatesService } from './templates.service';
import {
  CreateTemplateDto,
  TemplateResponseDto,
  UpdateTemplateDto,
} from './dto/template.dto';
import { Template } from '../entities/template.entity';
import { ApiStandardErrors } from 'src/common/decorators/api-standard-errors.decorator';
@ApiStandardErrors()
@ApiTags('Templates')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  private toDto(t: Template): TemplateResponseDto {
    return {
      id: t.id,
      name: t.name,
      contentAr: t.contentAr,
      contentEn: t.contentEn ?? null,
      description: t.description ?? null,
      ownerId: t.owner.id,
      teamId: t.team ? t.team.id : null,
      visibility: t.visibility,
      language: t.language ?? null,
      metadata: t.metadata ?? null,
      createdAt: t.createdAt.toISOString(), // FIXED: DTO expects string
      updatedAt: t.updatedAt.toISOString(), // FIXED: DTO expects string
    };
  }

  @Get()
  @ApiOperation({ summary: 'List templates for current user' })
  @ApiResponse({ status: 200, type: [TemplateResponseDto] })
  async findAll(
    @Query('ownerId', ParseIntPipe) ownerId: number,
  ): Promise<TemplateResponseDto[]> {
    const templates = await this.templatesService.findAll(ownerId);
    return templates.map((t) => this.toDto(t));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single template' })
  @ApiResponse({ status: 200, type: TemplateResponseDto })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('ownerId', ParseIntPipe) ownerId: number,
  ): Promise<TemplateResponseDto> {
    const t = await this.templatesService.findOne(id, ownerId);
    return this.toDto(t);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new template' })
  @ApiResponse({ status: 201, type: TemplateResponseDto })
  async create(
    @Query('ownerId', ParseIntPipe) ownerId: number,
    @Query('teamId') teamId: string | undefined,
    @Body() dto: CreateTemplateDto,
  ): Promise<TemplateResponseDto> {
    const teamIdNum = teamId ? parseInt(teamId, 10) : undefined;
    const t = await this.templatesService.create(ownerId, teamIdNum, dto);
    return this.toDto(t);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a template' })
  @ApiResponse({ status: 200, type: TemplateResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Query('ownerId', ParseIntPipe) ownerId: number,
    @Body() dto: UpdateTemplateDto,
  ): Promise<TemplateResponseDto> {
    const t = await this.templatesService.update(id, ownerId, dto);
    return this.toDto(t);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a template (soft delete)' })
  @ApiResponse({ status: 204 })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('ownerId', ParseIntPipe) ownerId: number,
  ): Promise<void> {
    await this.templatesService.remove(id, ownerId);
  }
}
