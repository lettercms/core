import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Post } from '@prisma/client';

export class PostEntity implements Post {
  @ApiProperty()
  blogId: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  created: Date;

  @ApiProperty()
  description: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  images: string[];

  @ApiProperty()
  protected: boolean;

  @ApiProperty()
  published: Date;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  status: $Enums.PostStatus;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  text: string;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  updated: Date;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  views: number;
}
