import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { ModelManagerService } from 'src/modelManager.service';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private modelManager: ModelManagerService,
  ) {}
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

  async findAll(blogId: string, query: Record<string, any>) {
    if (!blogId) {
      throw new UnauthorizedException();
    }

    const blog = await this.prisma.blog.findFirst({
      where: {
        OR: [
          {
            id: blogId,
          },
          {
            subdomain: blogId,
          },
        ],
      },
      select: {
        id: true,
      },
    });

    const where: Prisma.PostWhereInput = {
      blogId: blog.id,
    };

    if (query.status) {
      where.status = query.status;
    }

    return this.modelManager.paginate<PostEntity>(this.prisma.post, {
      where,
      orderBy: query.orderBy || 'created',
      ...query,
    });
  }

  async findOne(id: string, blogId: string, query: Record<string, any>) {
    const blog = await this.prisma.blog.findFirst({
      where: {
        OR: [
          {
            id: blogId,
          },
          {
            subdomain: blogId,
          },
        ],
      },
      select: {
        id: true,
      },
    });

    return this.modelManager.findOne<PostEntity>(this.prisma.post, {
      where: {
        OR: [
          {
            id,
          },
          {
            slug: id,
            blogId: blog.id,
          },
        ],
      },
      ...query,
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const now = new Date();

    const actualPostState = await this.modelManager.findOne<PostEntity>(
      this.prisma.post,
      {
        where: {
          id,
        },
        select: 'published',
      },
    );

    const data = {
      ...updatePostDto,
      updated: now,
      published: null,
    };

    if (updatePostDto.status === 'PUBLISHED' && !actualPostState.published) {
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
    const { id } = await this.findOne(slug, blog, {
      select: 'id',
    });

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
