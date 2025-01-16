import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { UnsplashModule } from 'src/unsplash.module';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  imports: [UnsplashModule],
})
export class ImagesModule {}
