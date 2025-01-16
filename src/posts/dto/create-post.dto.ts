import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty()
  category: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  images?: string[];

  @ApiProperty()
  slug?: string;

  @ApiProperty()
  tags?: string[];

  @ApiProperty()
  thumbnail?: string;

  @ApiProperty()
  title?: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  blogId: string;
}
