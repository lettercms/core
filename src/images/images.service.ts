import { Injectable } from '@nestjs/common';
import { UnsplashService } from 'src/unsplash.service';

@Injectable()
export class ImagesService {
  constructor(private unsplash: UnsplashService) {}

  searchImages(query: string, page: string) {
    return this.unsplash.searchImages(query, page);
  }

  trackUnsplashImage(url: string) {
    return this.unsplash.trackImage(url);
  }
}
