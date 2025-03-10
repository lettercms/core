import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Request,
  Param,
  Response,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserSessionEntity } from 'src/auth/entities/auth.entity';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const session = req.user as UserSessionEntity;

    if (!file) {
      throw new BadRequestException('File must be uploaded');
    }

    if (!session.blog) {
      throw new BadRequestException(
        'Invalid token. Token must include Blog ID',
      );
    }

    return this.imagesService.uploadFile(file, session.blog);
  }

  @Get()
  getFiles(@Request() req) {
    const session = req.user as UserSessionEntity;

    if (!session.blog) {
      throw new BadRequestException(
        'Invalid token. Token must include Blog ID',
      );
    }

    return this.imagesService.getFiles(session.blog);
  }

  @Public()
  @Get('/:blogId/:key')
  async getSingleFile(
    @Param('blogId') blogId: string,
    @Param('key') key: string,
    @Response() res,
  ) {
    const { body, contentType } = await this.imagesService.getSingleFile(
      blogId,
      key,
    );

    const file = await body.transformToByteArray();

    res.set('Content-Type', contentType);
    res.send(Buffer.from(file));
  }

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
