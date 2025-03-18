import { Injectable, NotFoundException } from '@nestjs/common';
import { MailService } from 'src/mail.service';
import { ModelManagerService } from 'src/modelManager.service';
import { PrismaService } from 'src/prisma.service';
import { InvitationEntity } from './entities/invitation.entity';
import { BlogEntity } from 'src/blogs/entities/blog.entity';

@Injectable()
export class InvitationsService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
    private modelManager: ModelManagerService,
  ) {}
  async inviteBlogMember(email: string, blogId: string, senderId: string) {
    const expireIn = Date.now() + 1000 * 60 * 60 * 24; //Expires in 1 day

    const blog = await this.modelManager.findOne<BlogEntity>(this.prisma.blog, {
      where: {
        id: blogId,
      },
      select: 'id,title',
    });

    if (!blog) {
      throw new Error('Blog not found');
    }

    //TODO: Handle message not sent
    await this.mail.sendMemberInvitationMail(email, {
      blogTitle: blog.title,
      id: blog.id,
    });

    const invitation = await this.prisma.invitation.create({
      data: {
        senderId,
        email,
        blogId,
        expiresIn: new Date(expireIn),
      },
    });

    console.log(invitation);

    return invitation;
  }

  async findOne(id: string, query: Record<string, any>) {
    const invitaiton = await this.modelManager.findOne<InvitationEntity>(
      this.prisma.invitation,
      {
        where: {
          id,
          expiresIn: {
            gt: new Date(),
          },
        },
        ...query,
      },
    );

    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: invitaiton.email,
      },
      select: {
        id: true,
      },
    });

    if (!invitaiton) {
      throw new NotFoundException('Invitation not found');
    }

    if (existingUser) {
      return {
        ...invitaiton,
        userId: existingUser.id,
      };
    }

    return invitaiton;
  }

  remove(id: number) {
    return `This action removes a #${id} invitation`;
  }
}
