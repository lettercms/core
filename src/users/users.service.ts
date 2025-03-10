import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Prisma } from '@prisma/client';
import { MailService } from 'src/mail.service';
import { ModelManagerService } from 'src/modelManager.service';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
    private modelManager: ModelManagerService,
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

  async findAll(query: Record<string, any>) {
    const users = await this.modelManager.paginate<UserEntity>(
      this.prisma.user,
      query,
    );

    return {
      data: users.data.map((e) => {
        delete e.password;

        return e;
      }),
      ...users,
    };
  }

  async findOne(id: string, query: Record<string, any>) {
    const user = await this.modelManager.findOne<UserEntity>(this.prisma.user, {
      where: {
        id,
      },
      ...query,
    });

    delete user.password;

    return user;
  }

  async findBlogMembers(blogId: string, query: Record<string, any>) {
    const members = await this.modelManager.paginate<UserEntity>(
      this.prisma.user,
      {
        where: {
          externalBlogs: {
            some: {
              blogId,
            },
          },
        },
        ...query,
      },
    );

    return {
      data: members.data.map((e) => {
        delete e.password;

        return e;
      }),
      ...members,
    };
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
