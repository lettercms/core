import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}
  create(createBlogDto: CreateBlogDto, userId: string) {
    return this.prisma.blog.create({
      data: {
        ...createBlogDto,
        userId,
        thumbnail:
          'https://cdn.jsdelivr.net/gh/lettercms/lettercms/apps/cdn/images/og-template.png',
        users: 0,
        posts: 0,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.blog.findMany({
      where: {
        userId,
      },
    });
  }

  findExternalsBlogs(userId: string) {
    return this.prisma.blog.findMany({
      where: {
        collaborators: {
          some: {
            userId,
          },
        },
      },
    });
  }

  findOne(id: string, userId: string) {
    return this.prisma.blog.findUnique({
      where: {
        id,
        userId,
      },
    });
  }

  incrementVisits(id: string) {
    return this.prisma.blog.update({
      where: {
        id,
      },
      data: {
        visits: {
          increment: 1,
        },
      },
    });
  }

  update(id: string, data: UpdateBlogDto) {
    return this.prisma.blog.update({
      where: {
        id,
      },
      data,
    });
  }

  remove(id: string) {
    return `This action removes a #${id} blog`;
  }
}
