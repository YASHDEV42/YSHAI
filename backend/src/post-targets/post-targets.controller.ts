import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post as HttpPost,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostTargetsService } from './post-targets.service';
import { PostTargetResponseDto } from './dto/post-target.dto';
import { ApiStandardErrors } from 'src/common/decorators/api-standard-errors.decorator';
@ApiStandardErrors()
@ApiTags('PostTargets')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class PostTargetsController {
  constructor(private readonly postTargetsService: PostTargetsService) {}

  @Get('posts/:postId/targets')
  @ApiOperation({ summary: 'List targets for a given post' })
  @ApiOkResponse({ type: [PostTargetResponseDto] })
  async findByPost(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<PostTargetResponseDto[]> {
    return await this.postTargetsService.findByPost(postId);
  }

  @Get('post-targets/:id')
  @ApiOperation({ summary: 'Get a single post target' })
  @ApiOkResponse({ type: PostTargetResponseDto })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PostTargetResponseDto> {
    return await this.postTargetsService.findOne(id);
  }

  @HttpPost('post-targets/:id/retry')
  @ApiOperation({ summary: 'Retry a failed post target' })
  @ApiOkResponse({ type: PostTargetResponseDto })
  async retry(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PostTargetResponseDto> {
    return await this.postTargetsService.retry(id);
  }

  @HttpPost('post-targets/:id/cancel')
  @ApiOperation({ summary: 'Cancel a pending or processing post target' })
  @ApiOkResponse({ type: PostTargetResponseDto })
  async cancel(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PostTargetResponseDto> {
    return await this.postTargetsService.cancel(id);
  }
}
