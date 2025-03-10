import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { UnsplashModule } from 'src/unsplash.module';
import { FileManagerModule } from 'src/fileManager.module';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  imports: [UnsplashModule, FileManagerModule],
})
export class ImagesModule {}
