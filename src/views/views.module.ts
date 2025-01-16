import { Module } from '@nestjs/common';
import { ViewsService } from './views.service';
import { ViewsController } from './views.controller';
import { PrismaModule } from 'src/prisma.module';
import { PostsService } from 'src/posts/posts.service';

@Module({
  controllers: [ViewsController],
  providers: [ViewsService, PrismaModule, PostsService],
  imports: [PrismaModule],
})
export class ViewsModule {}
