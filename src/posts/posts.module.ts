import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { ModelManagerModule } from 'src/modelManager.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [PrismaModule, ModelManagerModule],
})
export class PostsModule {}
