import {
  BadRequestException,
  Body,
  Controller,
  Post,
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
}
