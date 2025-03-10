import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { ModelManagerModule } from 'src/modelManager.module';

@Module({
  controllers: [BlogsController],
  providers: [BlogsService],
  imports: [PrismaModule, ModelManagerModule],
})
export class BlogsModule {}
