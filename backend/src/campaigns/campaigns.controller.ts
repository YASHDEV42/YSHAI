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
import { User } from '../entities/user.entity';
import { CampaignsService } from './campaigns.service';
import {
  CampaignResponseDto,
  CreateCampaignDto,
  UpdateCampaignDto,
} from './dto/campaign.dto';
import { Campaign } from '../entities/campaign.entity';
import { ApiStandardErrors } from 'src/common/decorators/api-standard-errors.decorator';
@ApiStandardErrors()
@ApiTags('Campaigns')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  private toDto(c: Campaign): CampaignResponseDto {
    return {
      id: c.id,
      name: c.name,
      description: c.description ?? null,
      ownerId: c.owner.id,
      teamId: c.team ? c.team.id : null,
      status: c.status,
      startsAt: c.startsAt ? c.startsAt.toISOString() : null, // FIXED: DTO expects string | null
      endsAt: c.endsAt ? c.endsAt.toISOString() : null, // FIXED: DTO expects string | null
      metadata: c.metadata ?? null,
      createdAt: c.createdAt.toISOString(), // FIXED: DTO expects string
      updatedAt: c.updatedAt.toISOString(), // FIXED: DTO expects string
    };
  }

  @Get()
  @ApiOperation({ summary: 'List campaigns for current user' })
  @ApiResponse({ status: 200, type: [CampaignResponseDto] })
  async findAll(
    @Query('ownerId', ParseIntPipe) ownerId: number,
  ): Promise<CampaignResponseDto[]> {
    const campaigns = await this.campaignsService.findAll(ownerId);
    return campaigns.map((c) => this.toDto(c));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single campaign' })
  @ApiResponse({ status: 200, type: CampaignResponseDto })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('ownerId', ParseIntPipe) ownerId: number,
  ): Promise<CampaignResponseDto> {
    const c = await this.campaignsService.findOne(id, ownerId);
    return this.toDto(c);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new campaign' })
  @ApiResponse({ status: 201, type: CampaignResponseDto })
  async create(
    @Query('ownerId', ParseIntPipe) ownerId: number,
    @Query('teamId') teamId: string | undefined,
    @Body() dto: CreateCampaignDto,
  ): Promise<CampaignResponseDto> {
    const teamIdNum = teamId ? parseInt(teamId, 10) : undefined;
    const c = await this.campaignsService.create(ownerId, teamIdNum, dto);
    return this.toDto(c);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a campaign' })
  @ApiResponse({ status: 200, type: CampaignResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Query('ownerId', ParseIntPipe) ownerId: number,
    @Body() dto: UpdateCampaignDto,
  ): Promise<CampaignResponseDto> {
    const c = await this.campaignsService.update(id, ownerId, dto);
    return this.toDto(c);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a campaign (soft delete)' })
  @ApiResponse({ status: 204 })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('ownerId', ParseIntPipe) ownerId: number,
  ): Promise<void> {
    await this.campaignsService.remove(id, ownerId);
  }
}
