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
import { getName as getCountryName } from 'i18n-iso-countries';
import { UserSessionEntity } from 'src/auth/entities/auth.entity';

@Controller('views')
export class ViewsController {
  constructor(private readonly viewsService: ViewsService) {}

  @Post('/:slug')
  setView(
    @Request() req,
    @Param('slug') slug: string,
    @Headers('cf-ipcountry') countryHeader: string,
    @Headers('sec-ch-ua-mobile') mobileHeader: string,
    @Headers('sec-ch-ua-platform') platformHeader: string,
    @Headers('sec-ch-ua') uaHeader: string,
    @Headers('referer') referer: string,
  ) {
    const session = req.user as UserSessionEntity;

    if (!session?.blog) {
      throw new BadRequestException('Missing Blog ID');
    }

    const country = countryHeader
      ? getCountryName(countryHeader, 'en')
      : 'Unknown';

    const device = !mobileHeader
      ? 'Unknown'
      : mobileHeader === '?0'
        ? 'desktop'
        : 'mobile';

    const platform = platformHeader
      ? platformHeader.replace(/"|'/g, '')
      : 'Unknown';

    const browser = uaHeader
      ? uaHeader.replace(/'|"/g, '').split(', ')[1].split(';')[0]
      : 'Unknown';

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

    console.log(start, end);

    return this.viewsService.getViews(session.blog, start, end);
  }
}
