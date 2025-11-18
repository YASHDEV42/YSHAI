import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
import { CampaignsService } from './campaigns.service';
import {
  CampaignResponseDto,
  CreateCampaignDto,
  UpdateCampaignDto,
} from './dto/campaign.dto';
import { Campaign } from '../entities/campaign.entity';
import { ApiStandardErrors } from 'src/common/decorators/api-standard-errors.decorator';
const logger = new Logger('campaigns');
@ApiStandardErrors()
@ApiTags('Campaigns')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  // Map entity -> DTO
  private toDto(c: Campaign): CampaignResponseDto {
    return {
      id: c.id,
      name: c.name,
      description: c.description ?? null,
      ownerId: c.owner.id,
      teamId: c.team ? c.team.id : null,
      status: c.status,
      startsAt: c.startsAt ? c.startsAt.toISOString() : null,
      endsAt: c.endsAt ? c.endsAt.toISOString() : null,
      metadata: c.metadata ?? null,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    };
  }

  @Get()
  @ApiOperation({ summary: 'List campaigns for current user (paginated)' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page (default 20, max 100)',
  })
  @ApiResponse({ status: 200, type: [CampaignResponseDto] })
  async findAll(
    @Req() req: { user: { id: number } },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<CampaignResponseDto[]> {
    const ownerId: number = req.user.id;
    const pageNum = page ? parseInt(page, 10) || 1 : 1;
    const limitNum = limit ? parseInt(limit, 10) || 20 : 20;
    logger.log(
      'Fetching campaigns for ownerId=' +
        ownerId +
        ', page=' +
        pageNum +
        ', limit=' +
        limitNum,
    );

    const campaigns = await this.campaignsService.findAll(
      ownerId,
      pageNum,
      limitNum,
    );
    return campaigns.map((c) => this.toDto(c));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single campaign owned by current user' })
  @ApiResponse({ status: 200, type: CampaignResponseDto })
  async findOne(
    @Req() req: { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CampaignResponseDto> {
    const ownerId: number = req.user.id;
    const c = await this.campaignsService.findOne(id, ownerId);
    return this.toDto(c);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new campaign for current user' })
  @ApiQuery({
    name: 'teamId',
    required: false,
    description: 'Optional team ID to associate with this campaign',
  })
  @ApiResponse({ status: 201, type: CampaignResponseDto })
  async create(
    @Req() req: { user: { id: number } },
    @Query('teamId') teamId: string | undefined,
    @Body() dto: CreateCampaignDto,
  ): Promise<CampaignResponseDto> {
    const ownerId: number = req.user.id;
    const teamIdNum = teamId ? parseInt(teamId, 10) : undefined;

    const c = await this.campaignsService.create(ownerId, teamIdNum, dto);
    return this.toDto(c);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a campaign owned by current user' })
  @ApiResponse({ status: 200, type: CampaignResponseDto })
  async update(
    @Req() req: { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCampaignDto,
  ): Promise<CampaignResponseDto> {
    const ownerId: number = req.user.id;
    const c = await this.campaignsService.update(id, ownerId, dto);
    return this.toDto(c);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a campaign (soft delete) for current user' })
  @ApiResponse({ status: 204, description: 'Campaign deleted' })
  async remove(
    @Req() req: { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const ownerId: number = req.user.id;
    await this.campaignsService.remove(id, ownerId);
  }
}
