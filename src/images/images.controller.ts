import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('search')
  search(@Query('q') q: string, @Query('page') page?: string) {
    if (!q) {
      throw new BadRequestException('Query must be defined');
    }

    return this.imagesService.searchImages(q, page || '1');
  }

  @Post('track')
  track(@Body('url') url: string) {
    if (!url) {
      throw new BadRequestException('Url must be defined');
    }

    return this.imagesService.trackUnsplashImage(url);
  }
}
