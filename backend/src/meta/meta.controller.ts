import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MetaService } from './meta.service';
import { OauthCallbackDto } from './dto/oauth-callback.dto';
import { PublishDto } from './dto/publish-media.dto';
import { IgProfileQueryDto } from './dto/ig-profile.dto';
import { IgPageQueryDto } from './dto/ig-page.dto';
import { IgPostsQueryDto } from './dto/ig-posts.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Meta')
@Controller('meta')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class MetaController {
  constructor(private readonly meta: MetaService) {}

  /**
   * POST /meta/oauth/callback
   * Exchanges short-lived user token -> long-lived; stores linkage for the current user.
   */
  @Post('oauth/callback')
  @ApiOperation({ summary: 'Handle OAuth callback (Instagram connect)' })
  @ApiBody({ type: OauthCallbackDto })
  @ApiResponse({ status: 201, description: 'Account linked successfully' })
  async oauthCallback(
    @Req() req: { user: { id: number } },
    @Body() body: OauthCallbackDto,
  ) {
    const { shortToken } = body;
    console.log('Received shortToken:', shortToken);
    const userId = req.user?.id;
    console.log('OAuth callback received for user:', userId);
    if (!shortToken || !userId)
      throw new BadRequestException(
        'shortToken and authenticated user are required',
      );

    const res = await this.meta.handleOauthCallback(shortToken, userId);
    return { success: true, data: res };
  }

  /**
   * POST /meta/publish
   * Publishes an image to the linked IG Business account for the current user.
   */
  @Post('publish')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype?.startsWith('image/')) {
          return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @UsePipes(new ValidationPipe({ transform: false, whitelist: false }))
  @ApiOperation({ summary: 'Publish a photo to Instagram Business' })
  @ApiBody({ type: PublishDto })
  @ApiResponse({ status: 201, description: 'Post published successfully' })
  async publish(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Req() req: { user: { id: number } },
    @Body() body: PublishDto,
  ) {
    if (!file) throw new BadRequestException('file is required');
    const userId = req.user.id;
    if (!userId) throw new BadRequestException('Missing authenticated user');

    const res = await this.meta.publishWithAutoRefresh({
      file,
      userId,
      caption: body.caption ?? '',
    });
    return { success: true, data: res };
  }

  /**
   * GET /meta/instagram/profile?pageId=...
   * Retrieves IG Business profile info. Tokens resolved server-side.
   */
  @Get('instagram/profile')
  @ApiOperation({ summary: 'Get Instagram Business profile info' })
  @ApiQuery({
    name: 'pageId',
    required: true,
    description: 'Facebook Page ID linked to IG account',
  })
  @ApiResponse({
    status: 200,
    description: 'Instagram profile retrieved successfully',
    schema: {
      example: {
        igUserId: '17841467983435199',
        username: 'yashai_app',
        followersCount: 3200,
        profilePicture: 'https://instagram.example.com/pic.jpg',
      },
    },
  })
  async getInstagramProfile(
    @Req() req: { user: { id: number } },
    @Query() q: IgProfileQueryDto,
  ) {
    const userId = req.user.id;
    if (!userId) throw new BadRequestException('Missing authenticated user');
    if (!q.pageId) throw new BadRequestException('pageId is required');

    const res = await this.meta.getInstagramProfileForUser(q.pageId, userId);
    return { success: true, data: res };
  }

  /**
   * GET /meta/instagram/page?igUserId=...
   * Resolves which Page is linked to a specific IG Business account for the current user.
   */
  @Get('instagram/page')
  @ApiOperation({
    summary: 'Find Page linked to an Instagram Business account',
  })
  @ApiQuery({ name: 'igUserId', required: true })
  async getPageIdFromIgAccount(@Req() req: any, @Query() q: IgPageQueryDto) {
    const userId = req.user?.id;
    if (!userId) throw new BadRequestException('Missing authenticated user');
    if (!q.igUserId) throw new BadRequestException('igUserId is required');

    const res = await this.meta.getPageIdFromIgAccountForUser(
      q.igUserId,
      userId,
    );
    return { success: true, data: res };
  }

  /**
   * GET /meta/instagram/posts?igUserId=...&limit=...&after=...
   * Lists IG posts with pagination cursors.
   */
  @Get('instagram/posts')
  @ApiOperation({ summary: 'Get posts for IG Business account (paginated)' })
  @ApiQuery({ name: 'igUserId', required: true })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'after', required: false })
  async getInstagramPosts(
    @Req() req: { user: { id: number } },
    @Query() q: IgPostsQueryDto,
  ) {
    const userId = req.user.id;
    if (!userId) throw new BadRequestException('Missing authenticated user');
    if (!q.igUserId) throw new BadRequestException('igUserId is required');

    const res = await this.meta.getInstagramPostsForUser({
      igUserId: q.igUserId,
      userId,
      limit: q.limit,
      after: q.after,
    });
    return { ...res };
  }
}
