import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { UserSessionEntity } from '../auth/entities/auth.entity';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  create(@Body() createBlogDto: CreateBlogDto, @Request() req) {
    const session = req.user as UserSessionEntity;

    return this.blogsService.create(createBlogDto, session.user);
  }

  @Get()
  findAll(@Request() req) {
    const session = req.user as UserSessionEntity;

    return this.blogsService.findAll(session.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const session = req.user as UserSessionEntity;

    return this.blogsService.findOne(id, session.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
}
