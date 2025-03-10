import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { UserSessionEntity } from 'src/auth/entities/auth.entity';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  inviteMember(@Request() req, @Body('email') email) {
    const session = req.user as UserSessionEntity;

    if (!session.blog) {
      throw new UnauthorizedException(
        'Invalid token. Token must include Blog ID',
      );
    }

    if (!session.user) {
      throw new UnauthorizedException(
        'Invalid token. Token must include User ID',
      );
    }

    return this.invitationsService.inviteBlogMember(
      email,
      session.blog,
      session.user,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() query) {
    return this.invitationsService.findOne(id, query);
  }
}
