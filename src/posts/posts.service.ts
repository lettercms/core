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
        include: {
          author: true,
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

  async update(id: string, updatePostDto: UpdatePostDto) {
    const now = new Date();

    const data = {
      ...updatePostDto,
      updated: now,
      published: null,
    };

    if (updatePostDto.status === 'PUBLISHED') {
      data.published = now;
    }

    const updatedData = await this.prisma.post.update({
      where: {
        id,
      },
      data,
    });

    //TODO: Improve revalidation service
    if (process.env.DAVIDSDEVEL_URL) {
      this.revalidateData(updatedData);
    }

    return updatedData;
  }

  revalidateData(data) {
    return fetch(`${process.env.DAVIDSDEVEL_URL}/api/revalidation/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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

  async remove(id: string, blogId: string) {
    const data = await this.prisma.post.delete({
      where: {
        id,
      },
    });

    await this.prisma.blog.update({
      where: {
        id: blogId,
      },
      data: {
        posts: {
          decrement: 1,
        },
      },
    });

    //TODO: Improve revalidation service
    if (process.env.DAVIDSDEVEL_URL) {
      this.revalidateData(data);
    }

    return data;
  }
}
