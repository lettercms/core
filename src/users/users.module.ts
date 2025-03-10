import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MailModule } from 'src/mail.module';
import { ModelManagerModule } from 'src/modelManager.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule, MailModule, ModelManagerModule],
})
export class UsersModule {}
