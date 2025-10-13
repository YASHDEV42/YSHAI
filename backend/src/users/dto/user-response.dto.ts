
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: ['user', 'admin'] })
  role: 'user' | 'admin';

  @ApiProperty({ required: false })
  timezone?: string;

  @ApiProperty()
  isEmailVerified: boolean;

  @ApiProperty({ required: false })
  language?: string;

  @ApiProperty({ required: false })
  locale?: string;

  @ApiProperty({ required: false, enum: ['12h', '24h'] })
  timeFormat?: '12h' | '24h';

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromEntity(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.name = user.name;
    dto.role = user.role;
    dto.timezone = user.timezone;
    dto.isEmailVerified = user.isEmailVerified;
    dto.language = user.language;
    dto.locale = user.locale;
    dto.timeFormat = user.timeFormat;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
