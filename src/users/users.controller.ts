import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
  findAll(@Query() query) {
    return this.usersService.findAll(query);
  }

  @Get('profile')
  async getProfile(@Request() req, @Query() query) {
    const session = req.user as UserSessionEntity;

    const data = await this.usersService.findOne(session.user, query);

    return data;
  }

  @Get('members')
  findMembers(@Request() req, @Query() query) {
    const session = req.user as UserSessionEntity;

    if (!session.blog) {
      throw new UnauthorizedException(
        'Invalid token. Token must include Blog ID',
      );
    }

    return this.usersService.findBlogMembers(session.blog, query);
  }

  @Post('verify-email')
  verifyEmail(@Body('email') email: string) {
    return this.usersService.sendVerificationEmail(email);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() query) {
    return this.usersService.findOne(id, query);
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
