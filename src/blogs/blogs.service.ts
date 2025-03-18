import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ModelManagerService } from 'src/modelManager.service';
import { BlogEntity } from './entities/blog.entity';

@Injectable()
export class BlogsService {
  constructor(
    private prisma: PrismaService,
    private modelManager: ModelManagerService,
  ) {}
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

  findAll(userId: string, query: Record<string, any>) {
    return this.modelManager.paginate<BlogEntity>(this.prisma.blog, {
      where: {
        userId,
      },
      ...query,
    });
  }

  findExternalsBlogs(userId: string, query: Record<string, any>) {
    this.modelManager
      .paginate<BlogEntity>(this.prisma.collaboratorsOnBlogs, {
        where: {},
      })
      .then(console.log);

    return this.modelManager.paginate<BlogEntity>(this.prisma.blog, {
      where: {
        collaborators: {
          some: {
            userId,
          },
        },
      },
      ...query,
    });
  }

  findOne(id: string, userId: string, query: Record<string, any>) {
    return this.modelManager.findOne<BlogEntity>(this.prisma.blog, {
      where: {
        OR: [
          {
            id,
            userId,
          },
          {
            subdomain: id,
          },
        ],
      },
      ...query,
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

  async remove(id: string) {
    const blog = await this.prisma.blog.delete({
      where: {
        id,
      },
    });
    await this.prisma.post.deleteMany({
      where: {
        blogId: id,
      },
    });
    await this.prisma.view.deleteMany({
      where: {
        blogId: id,
      },
    });
    await this.prisma.collaboratorsOnBlogs.deleteMany({
      where: {
        blogId: id,
      },
    });
    return blog;
  }
}
