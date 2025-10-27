import { BadRequestException, Body, Controller, Logger, NotFoundException, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MetaService } from './meta.service';
import { OauthCallbackDto } from './dto/oauth-callback.dto';
import { AccountsService } from 'src/accounts/accounts.service';
import { EntityManager } from '@mikro-orm/core';
import { SocialAccount } from 'src/entities/social-account.entity';
import { HttpService } from '@nestjs/axios';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from 'src/media/media.service';
import { lastValueFrom } from 'rxjs';

@Controller('meta')

export class MetaController {
  private readonly logger = new Logger(MetaController.name);
  constructor(
    private readonly meta: MetaService,
    private readonly accounts: AccountsService,
    private readonly em: EntityManager,
    private readonly mediaService: MediaService,
    private readonly httpService: HttpService,
  ) { }

  @Post('oauth/callback')
  async oauthCallback(@Body() { shortToken, userId }: OauthCallbackDto) {
    // 1) get long-lived user token
    let longUser: { access_token: string; expires_in: number };
    try {
      longUser = await this.meta.exchangeShortToLong(shortToken);
    } catch (e) {
      console.warn('⚠️ exchangeShortToLong failed, using original token');
      longUser = { access_token: shortToken, expires_in: 5184000 }; // 60 days fallback
    }

    // 2) get pages for this user
    const pages = (await this.meta.listPages(longUser.access_token)).data ?? [];
    if (!pages.length) {
      throw new Error('No Facebook Pages found for this user');
    }
    const page = pages[0]; // MVP: pick first page (later let user choose)
    const pageToken = page.access_token;

    // 3) get Instagram Business user id from page
    const igUserId = await this.meta.getIgUserId(page.id, pageToken);
    if (!igUserId) {
      throw new Error('No Instagram Business account connected to the selected Page');
    }

    // 4) Persist via your AccountsService
    const result = await this.accounts.link(
      Number(userId),
      { provider: 'instagram', providerAccountId: igUserId },
      {
        accessToken: pageToken,                 // used for posting
        refreshToken: longUser.access_token,    // long-lived user token (~60d)
        expiresAt: new Date(Date.now() + longUser.expires_in * 1000),
      },
    );

    return {
      ...result,
      providerAccountId: igUserId,
      pageId: page.id,
      pageName: page.name,
    };
  }

  @Post('publish')
  @UseInterceptors(FileInterceptor('file'))
  async publish(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { userId: number; caption: string },
  ) {
    try {
      if (!file) throw new BadRequestException('File is missing');
      const media = await this.mediaService.upload({ buffer: file.buffer });

      const account = await this.em.findOne(
        SocialAccount,
        { user: body.userId, provider: 'instagram' },
        { populate: ['tokens'] },
      );
      if (!account) throw new NotFoundException('Instagram account not linked');

      const accessToken = account.tokens.find(
        (t) => t.tokenType === 'access',
      )?.tokenEncrypted;
      if (!accessToken) throw new BadRequestException('Missing access token');

      const igUserId = account.providerAccountId;
      const isVideo = media.type === 'video';
      const uploadField = isVideo ? 'video_url' : 'image_url';
      const uploadUrl = `https://graph.facebook.com/v21.0/${igUserId}/media`;

      const mediaRes = await lastValueFrom(
        this.httpService.post(uploadUrl, {
          [uploadField]: media.url,
          caption: body.caption,
          access_token: accessToken,
        }),
      );

      const creationId = mediaRes.data.id;
      if (!creationId) throw new BadRequestException('Failed to get media creation ID');

      if (isVideo) {
        await this.waitForMediaReady(igUserId, creationId, accessToken);
      }

      // small delay for safety
      await new Promise((r) => setTimeout(r, 3000));

      const publishRes = await lastValueFrom(
        this.httpService.post(
          `https://graph.facebook.com/v21.0/${igUserId}/media_publish`,
          { creation_id: creationId, access_token: accessToken },
        ),
      );

      const postId = publishRes.data.id;

      // ✅ fetch post details
      const detailsRes = await lastValueFrom(
        this.httpService.get(
          `https://graph.facebook.com/v21.0/${postId}`,
          {
            params: {
              fields: 'id,permalink,media_type,media_url,caption,timestamp',
              access_token: accessToken,
            },
          },
        ),
      );

      const details = detailsRes.data;

      this.logger.log('✅ Instagram publish success:', details);

      return {
        success: true,
        message: 'Post published successfully 🎉',
        instagramPostId: details.id,
        permalink: details.permalink,
        mediaType: details.media_type,
        mediaUrl: details.media_url,
        caption: details.caption,
        timestamp: details.timestamp,
        cloudinaryUrl: media.url,
      };
    } catch (error) {
      this.logger.error(
        `❌ Publish failed: ${error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message
        }`,
      );
      throw new BadRequestException(
        error.response?.data || error.message || 'Internal error',
      );
    }
  }

  // Helper function to poll media upload status for videos
  private async waitForMediaReady(
    igUserId: string,
    creationId: string,
    accessToken: string,
  ) {
    this.logger.log('🎥 Waiting for video processing...');
    const statusUrl = `https://graph.facebook.com/v21.0/${creationId}?fields=status_code&access_token=${accessToken}`;

    for (let attempt = 0; attempt < 10; attempt++) {
      const statusRes = await lastValueFrom(this.httpService.get(statusUrl));
      const status = statusRes.data?.status_code;

      if (status === 'FINISHED') {
        this.logger.log('✅ Video processing complete.');
        return;
      } else if (status === 'ERROR') {
        throw new Error('❌ Video processing failed.');
      }

      await new Promise((r) => setTimeout(r, 3000)); // wait 3s between checks
    }

    throw new Error('⏰ Video processing timed out.');
  }
}
