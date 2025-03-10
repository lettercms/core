import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GmailDto } from './dto/gmail.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signin(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('No credentials found');
    }

    const matchPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!matchPassword) {
      throw new UnauthorizedException('No credentials found');
    }

    return {
      user: user.id,
    };
  }

  async gmail(data: GmailDto) {
    let user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: data.email,
          name: data.given_name,
          lastname: data.family_name,
          profilePicture: data.picture,
          verified: true,
        },
      });
    }

    return {
      status: 'OK',
      user,
    };
  }
}
