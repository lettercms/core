import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';

@Module({
  controllers: [BlogsController],
  providers: [BlogsService],
  imports: [PrismaModule],
})
export class BlogsModule {}
