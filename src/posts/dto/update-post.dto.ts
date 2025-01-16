import { ApiProperty, PartialType } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty()
  category?: string;

  @ApiProperty()
  content?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  images?: string[];

  @ApiProperty()
  slug?: string;

  @ApiProperty()
  tags?: string[];

  @ApiProperty()
  status: $Enums.PostStatus;

  @ApiProperty()
  thumbnail?: string;

  @ApiProperty()
  title?: string;
}
