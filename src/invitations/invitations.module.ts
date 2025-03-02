import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { PrismaModule } from 'src/prisma.module';
import { MailModule } from 'src/mail.module';

@Module({
  controllers: [InvitationsController],
  providers: [InvitationsService],
  imports: [PrismaModule, MailModule],
})
export class InvitationsModule {}
