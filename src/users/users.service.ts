import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const { blogId } = createUserDto;

    if (blogId) {
      delete createUserDto.blogId;
    }

    const data: Prisma.UserCreateInput = {
      ...createUserDto,
      profilePicture: `https://avatar.tobi.sh/${createUserDto.name}+${createUserDto.lastname}.svg`,
    };

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    if (blogId) {
      data.externalBlogs = {
        create: {
          blog: {
            connect: {
              id: blogId,
            },
          },
        },
      };
    }

    return this.prisma.user.create({
      data,
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findBlogMember(blogId: string) {
    const collabs = await this.prisma.user.findMany({
      where: {
        externalBlogs: {
          some: {
            blogId,
          },
        },
      },
    });

    //TODO: Improve Data collection
    return collabs.map((e) => {
      delete e.password;

      return e;
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
