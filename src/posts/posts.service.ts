import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PostStatus, Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from '../prisma.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}
  async create(blogId: string, userId: string) {
    const now = new Date();

    const created = await this.prisma.post.create({
      data: {
        userId,
        blogId,
        created: now,
        updated: now,
        views: 0,
      },
    });

    await this.prisma.blog.update({
      where: {
        id: blogId,
      },
      data: {
        posts: {
          increment: 1,
        },
      },
    });

    return created;
  }

  findAll(blogId?: string, take = 10, page = 1, status?: PostStatus) {
    if (!blogId) {
      throw new UnauthorizedException();
    }

    const where: Prisma.PostWhereInput = {
      blogId,
    };

    if (status) {
      where.status = status;
    }

    const paginate = createPaginator({ perPage: take });

    return paginate<PostEntity, Prisma.PostFindManyArgs>(
      this.prisma.post,
      {
        where,
        orderBy: {
          created: 'desc',
        },
      },
      {
        page,
      },
    );
  }

  findOne(id: string, blogId: string) {
    return this.prisma.post.findFirst({
      where: {
        OR: [
          {
            id,
          },
          {
            slug: id,
            blogId,
          },
        ],
      },
      include: {
        author: true,
      },
    });
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    const now = new Date();

    const data = {
      ...updatePostDto,
      updated: now,
      published: null,
    };

    if (updatePostDto.status === 'PUBLISHED') {
      data.published = now;
    }
    return this.prisma.post.update({
      where: {
        id,
      },
      data,
    });
  }

  async incrementView(blog: string, slug: string) {
    const { id } = await this.findOne(slug, blog);

    return this.prisma.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  remove(id: string) {
    return this.prisma.post.delete({
      where: {
        id,
      },
    });
  }
}
