import { Injectable } from '@nestjs/common';
import { MailService } from 'src/mail.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class InvitationsService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}
  async inviteBlogMember(email: string, blogId: string, senderId: string) {
    const expireIn = Date.now() + 1000 * 60 * 60 * 24; //Expires in 1 day

    const blog = await this.prisma.blog.findUnique({
      where: {
        id: blogId,
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (!blog) {
      throw new Error('Blog not found');
    }

    //TODO: Handle message not sent
    await this.mail.sendMemberInvitationMail(email, {
      blogTitle: blog.title,
      id: blog.id,
    });

    return this.prisma.invitation.create({
      data: {
        senderId,
        email,
        blogId,
        expiresIn: new Date(expireIn),
      },
    });
  }

  findOne(id: string) {
    return this.prisma.invitation.findUnique({
      where: {
        id,
        expiresIn: {
          gt: new Date(),
        },
      },
      include: {
        sender: true,
        blog: true,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} invitation`;
  }
}
