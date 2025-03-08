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
import { ApiPaginatedResponse } from '../commons/decorators/pagination';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Request() req) {
    const session = req.user as UserSessionEntity;

    if (!session.blog) {
      throw new UnauthorizedException(
        'Invalid token. Token must include Blog ID',
      );
    }

    return this.postsService.create(session.blog, session.user);
  }

  @Get()
  @ApiPaginatedResponse(PostEntity)
  findAll(
    @Request() req,
    @Query('page') page,
    @Query('limit') limit,
    @Query('status') status,
  ) {
    const session = req.user as UserSessionEntity;

    return this.postsService.findAll(session.blog, limit, page, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const session = req.user as UserSessionEntity;

    return this.postsService.findOne(id, session.blog);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const session = req.user as UserSessionEntity;

    return this.postsService.remove(id, session.blog);
  }
}
