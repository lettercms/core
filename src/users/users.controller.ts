import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { UserSessionEntity } from '../auth/entities/auth.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.blogId) {
      return this.usersService.createNewMember(createUserDto);
    }

    return this.usersService.createNewUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  async getProfile(@Request() req) {
    const session = req.user as UserSessionEntity;

    const data = await this.usersService.findOne(session.user);

    return data;
  }

  @Get('members')
  findMembers(@Request() req) {
    const session = req.user as UserSessionEntity;

    if (!session.blog) {
      throw new UnauthorizedException(
        'Invalid token. Token must include Blog ID',
      );
    }

    return this.usersService.findBlogMember(session.blog);
  }

  @Post('verify-email')
  verifyEmail(@Body('email') email: string) {
    return this.usersService.sendVerificationEmail(email);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
