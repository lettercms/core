import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { PrismaModule } from 'src/prisma.module';
import { MailModule } from 'src/mail.module';
import { FileManagerModule } from 'src/fileManager.module';
import { ModelManagerModule } from 'src/modelManager.module';

@Module({
  controllers: [InvitationsController],
  providers: [InvitationsService],
  imports: [PrismaModule, MailModule, FileManagerModule, ModelManagerModule],
})
export class InvitationsModule {}
