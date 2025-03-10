import { Injectable, NotFoundException } from '@nestjs/common';
import { createApi } from 'unsplash-js';

const api = createApi({
  accessKey: process.env.UNSPLASH_API_KEY as string,
});

@Injectable()
export class UnsplashService {
  private unsplashApi = api;

  async trackImage(url: string) {
    this.unsplashApi.photos.trackDownload({
      downloadLocation: `https://api.unsplash.com/photos${url}`,
    });
  }
  async searchImages(query: string, page: string) {
    const photos = await this.unsplashApi.search.getPhotos({
      query,
      page: Number.parseInt(page),
      perPage: 20,
    });

    if (!photos.response) {
      throw new NotFoundException('No images found');
    }

    const data = photos.response.results.map((e) => {
      return {
        url: e.urls.regular,
        thumbnail: e.urls.thumb,
        raw: e.urls.raw,
        width: e.width,
        height: e.height,
        color: e.color,
        download: e.links.download_location,
        user: {
          name: e.user.name,
          profile: `${e.user.links.html}?utm_source=lettercms&utm_medium=referral`, //Unsplash attribution. See https://help.unsplash.com/api-guidelines/unsplash-api-guidelines
        },
      };
    });

    return {
      data,
      pages: photos.response.total_pages,
      total: photos.response.total,
    };
  }
}
