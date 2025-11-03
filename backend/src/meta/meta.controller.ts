import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MetaService } from './meta.service';

type OauthCallbackBody = {
  shortToken: string;
  userId: string;
};

@Controller('meta')
export class MetaController {
  constructor(private readonly meta: MetaService) {}

  @Post('oauth/callback')
  async oauthCallback(@Body() body: OauthCallbackBody) {
    const { shortToken, userId } = body;
    console.log('Received OAuth callback with :', shortToken, userId);

    if (!shortToken || !userId) {
      throw new BadRequestException(
        'shortToken and numeric userId are required',
      );
    }
    return this.meta.handleOauthCallback(shortToken, userId);
  }

  @Post('publish')
  @UseInterceptors(FileInterceptor('file'))
  async publish(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: { userId?: string | number; caption?: string },
  ) {
    if (!file) throw new BadRequestException('file is required');
    const userIdNum = Number(body.userId);
    if (Number.isNaN(userIdNum)) {
      throw new BadRequestException('userId (number) is required');
    }
    const caption = body.caption ?? '';
    return this.meta.publishWithAutoRefresh({
      file,
      userId: userIdNum,
      caption,
    });
  }

  /**
   * 🔹 GET /meta/instagram/profile?pageId=...&pageToken=...
   * Returns IG profile (username, followers, profile picture)
   */
  @Get('instagram/profile')
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
   * Finds which Page is linked to a given IG business account
   */
  @Get('instagram/page')
  async getPageIdFromIgAccount(
    @Query('igUserId') igUserId: string,
    @Query('userToken') userToken: string,
  ) {
    if (!igUserId || !userToken) {
      throw new BadRequestException('igUserId and userToken are required');
    }
    return this.meta.getPageIdFromIgAccount(igUserId, userToken);
  }
}
