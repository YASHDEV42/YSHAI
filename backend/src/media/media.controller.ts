// media/media.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  Param,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { MediaService } from './media.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import { MediaResponseDto } from './dto/media-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
@ApiTags('media')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload a media file (image or video) to Cloudinary',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Media file to upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The media file (image or video)',
        },
        postId: {
          type: 'number',
          description: 'Optional: ID of the post to associate with',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Media uploaded successfully',
    type: MediaResponseDto,
  })
  async upload(
    @UploadedFile() file: { path?: string; buffer?: Buffer },
    @Body() dto: UploadMediaDto,
  ): Promise<MediaResponseDto> {
    return this.mediaService.upload(file, dto.postId);
  }

  @Get()
  @ApiOperation({ summary: 'List all uploaded media' })
  @ApiResponse({
    status: 200,
    description: 'List of media files',
    type: [MediaResponseDto],
  })
  async findAll(): Promise<MediaResponseDto[]> {
    return this.mediaService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a media file from Cloudinary and database' })
  @ApiResponse({ status: 200, description: 'Media deleted successfully' })
  @ApiResponse({ status: 404, description: 'Media not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.mediaService.remove(id);
    return { message: 'Media deleted successfully' };
  }
}
