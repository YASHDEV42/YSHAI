
import { IsString, IsOptional } from 'class-validator';

export class PublishMediaDto {
  @IsString()
  igUserId: string;

  @IsString()
  pageToken: string;

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  caption?: string;
}
