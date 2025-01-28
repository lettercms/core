import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ViewsService } from './views.service';
import { UserSessionEntity } from 'src/auth/entities/auth.entity';
import { Country } from 'src/commons/decorators/country';
import { UserAgent } from 'src/commons/decorators/user-agent';

@Controller('views')
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}

  @Post('/:slug')
  setView(
    @Request() req,
    @Param('slug') slug: string,
    @Headers('referer') referer: string,
    @Country() country,
    @UserAgent() userAgent,
  ) {
    const session = req.user as UserSessionEntity;

    if (!session?.blog) {
      throw new BadRequestException('Missing Blog ID');
    }

    //TODO: Improve device data collection
    const device = userAgent.device.type === 'mobile' ? 'mobile' : 'desktop';

    const platform = userAgent.os.name ?? 'Unknown';
    const browser = userAgent.browser.name ?? 'Unknown';

    return this.viewsService.registerView(
      session.blog,
      slug,
      referer,
      country,
      device,
      browser,
      platform,
    );
  }

  @Get('/')
  getViews(@Request() req, @Query('start') start, @Query('end') end) {
    const session = req.user as UserSessionEntity;

    if (!session?.blog) {
      throw new BadRequestException('Missing Blog ID');
    }

    if (start) {
      start = +start;
    }

    if (end) {
      end = +end;
    }

    return this.viewsService.getViews(session.blog, start, end);
  }
}
