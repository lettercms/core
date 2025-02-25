import { Module } from '@nestjs/common';
import { ViewsService } from './views.service';
import { ViewsController } from './views.controller';
import { PrismaModule } from 'src/prisma.module';
import { PostsService } from 'src/posts/posts.service';
import { BlogsService } from 'src/blogs/blogs.service';

@Module({
  controllers: [ViewsController],
  providers: [ViewsService, PostsService, BlogsService],
  imports: [PrismaModule],
})
export class ViewsModule {}
