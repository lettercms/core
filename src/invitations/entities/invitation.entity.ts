import { Invitation } from '@prisma/client';

export class InvitationEntity implements Invitation {
  id: string;
  email: string;
  blogId: string;
  expiresIn: Date;
  senderId: string;
}
