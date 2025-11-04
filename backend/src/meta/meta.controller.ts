import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
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

@ApiTags('Meta')
@Controller('meta')
export class MetaController {
  constructor(private readonly meta: MetaService) {}

  /**
   * 🔹 POST /meta/oauth/callback
   * Handles OAuth callback from Meta after user connects Instagram.
   */
  @Post('oauth/callback')
  @ApiOperation({ summary: 'Handle OAuth callback (Instagram connect)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        shortToken: {
          type: 'string',
          description: 'Short-lived user token from Meta OAuth',
        },
      },
      required: ['shortToken', 'userId'],
    },
  })
  @ApiResponse({ status: 201, description: 'Account linked successfully' })
  async oauthCallback(
    @Req() req: { user: { id: number } },
    @Body() body: { shortToken: string },
  ) {
    const { shortToken } = body;
    if (!shortToken || !req.user.id) {
      throw new BadRequestException('shortToken and userId are required');
    }
    //here we cast the user id to string because in the dto its string
    return this.meta.handleOauthCallback(shortToken, req.user.id);
  }

  /**
   * 🔹 POST /meta/publish
   * Publishes an image with a caption to the connected Instagram Business account.
   */
  @Post('publish')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  @ApiOperation({ summary: 'Publish a photo to Instagram Business' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        caption: { type: 'string', description: 'Caption for the post' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
      },
      required: ['file', 'userId'],
    },
  })
  @ApiResponse({ status: 201, description: 'Post published successfully' })
  async publish(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Req() req: { user: { id: number } },
    @Body() body: { caption?: string },
  ) {
    if (!file) throw new BadRequestException('file is required');

    const caption = body.caption ?? '';
    return this.meta.publishWithAutoRefresh({
      file,
      userId: req.user.id,
      caption,
    });
  }

  /**
   * 🔹 GET /meta/instagram/profile?pageId=...&pageToken=...
   * Retrieves Instagram Business profile details (username, followers, avatar).
   */
  @Get('instagram/profile')
  @ApiOperation({ summary: 'Get Instagram Business profile info' })
  @ApiQuery({
    name: 'pageId',
    required: true,
    description: 'Facebook Page ID linked to IG account',
  })
  @ApiQuery({
    name: 'pageToken',
    required: true,
    description: 'Page access token',
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
    @Query('pageId') pageId: string,
    @Query('pageToken') pageToken: string,
  ) {
    if (!pageId || !pageToken) {
      throw new BadRequestException('pageId and pageToken are required');
    }
    return this.meta.getInstagramProfile(pageId, pageToken);
  }

  /**
   * 🔹 GET /meta/instagram/page?igUserId=...&userToken=...
   * Finds which Facebook Page is linked to a given IG Business account.
   */
  @Get('instagram/page')
  @ApiOperation({
    summary: 'Find Page linked to an Instagram Business account',
  })
  @ApiQuery({
    name: 'igUserId',
    required: true,
    description: 'Instagram Business account ID',
  })
  @ApiQuery({
    name: 'userToken',
    required: true,
    description: 'Long-lived user access token',
  })
  @ApiResponse({
    status: 200,
    description: 'Linked Facebook Page found',
    schema: {
      example: {
        pageId: '817552788113650',
        pageName: 'YSHAI',
      },
    },
  })
  async getPageIdFromIgAccount(
    @Query('igUserId') igUserId: string,
    @Query('userToken') userToken: string,
  ) {
    if (!igUserId || !userToken) {
      throw new BadRequestException('igUserId and userToken are required');
    }
    return this.meta.getPageIdFromIgAccount(igUserId, userToken);
  }

  /**
   * 🔹 GET /meta/instagram/posts?igUserId=...&accessToken=...
   * Retrieves all recent posts from the connected Instagram Business account.
   */
  @Get('instagram/posts')
  @ApiOperation({
    summary: 'Get posts from connected Instagram Business account',
  })
  @ApiQuery({
    name: 'igUserId',
    required: true,
    description: 'Instagram Business account ID',
  })
  @ApiQuery({
    name: 'accessToken',
    required: true,
    description: 'Page access token',
  })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'after', required: false })
  @ApiResponse({
    status: 200,
    description: 'List of posts retrieved successfully',
    schema: {
      example: [
        {
          id: '1234567890',
          caption: 'AI makes social media easy 🚀',
          mediaUrl: 'https://instagram.example.com/image.jpg',
          permalink: 'https://www.instagram.com/p/xyz/',
          timestamp: '2025-11-03T14:35:21+0000',
          likeCount: 45,
          commentsCount: 12,
          mediaType: 'IMAGE',
        },
      ],
    },
  })
  async getInstagramPosts(
    @Query('igUserId') igUserId: string,
    @Query('accessToken') accessToken: string,
  ) {
    if (!igUserId || !accessToken) {
      throw new BadRequestException('igUserId and accessToken are required');
    }
    return this.meta.getInstagramPosts(igUserId, accessToken);
  }
}
