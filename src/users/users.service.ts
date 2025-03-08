import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Prisma } from '@prisma/client';
import { MailService } from 'src/mail.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}
  private async create(data: Prisma.UserCreateInput) {
    const creationData: Prisma.UserCreateInput = {
      ...data,
      name: '',
      lastname: '',
      profilePicture: `https://avatar.tobi.sh/${encodeURI(data.email)}.svg`,
    };

    if (data.password) {
      creationData.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.create({
      data: creationData,
    });
  }

  private async validateVerificationCode(email, code) {
    const verificationCode = await this.prisma.verificationCodes.findFirst({
      where: {
        email,
        code,
      },
    });

    if (!verificationCode) {
      return false;
    }

    if (verificationCode.expires < new Date()) {
      return false;
    }

    return true;
  }

  async createNewUser(createUserDto: CreateUserDto) {
    const isValidVerificationCode = await this.validateVerificationCode(
      createUserDto.email,
      createUserDto.verificationCode,
    );

    if (!isValidVerificationCode) {
      throw new UnauthorizedException('Invalid verification code');
    }

    const creationData: Prisma.UserCreateInput = {
      ...createUserDto,
      profilePicture: '',
    };

    return this.create(creationData);
  }

  async createNewMember(createUserDto: CreateUserDto) {
    const { blogId } = createUserDto;

    if (blogId) {
      delete createUserDto.blogId;
    }

    const data: Prisma.UserCreateInput = {
      ...createUserDto,
      externalBlogs: {
        create: {
          blog: {
            connect: {
              id: blogId,
            },
          },
        },
      },
      profilePicture: '',
    };

    return this.create(data);
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

  async sendVerificationEmail(email: string) {
    const expires = Date.now() + 1000 * 60 * 10; //Expires in 10 minutes

    const code = this.generateVerificationCode();

    await this.prisma.verificationCodes.upsert({
      where: {
        email,
      },
      update: {
        code,
        expires: new Date(expires),
      },
      create: {
        code,
        email,
        expires: new Date(expires),
      },
    });

    //TODO: Handle message not sent
    await this.mail.sendVerificationCode(email, {
      code,
    });

    return {
      status: 'OK',
    };
  }

  private generateVerificationCode() {
    return randomBytes(4).toString('hex');
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
