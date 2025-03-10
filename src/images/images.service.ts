import { Injectable } from '@nestjs/common';
import { FileManagerService } from 'src/fileManager.service';
import { UnsplashService } from 'src/unsplash.service';

@Injectable()
export class ImagesService {
  constructor(
    private unsplash: UnsplashService,
    private fileManager: FileManagerService,
  ) {}

  async getFiles(blogId: string) {
    const data = await this.fileManager.getFiles(`${blogId}`);

    return {
      data:
        data.Contents?.map((e) => {
          const url = `${process.env.UPLOAD_URL}/${e.Key}`;

          return {
            url,
            thumbnail: url,
            raw: url,
          };
        }) || [],
      pages: Math.ceil(data.KeyCount / data.MaxKeys),
      total: data.KeyCount,
    };
  }

  async getSingleFile(blogId: string, key: string) {
    const file = await this.fileManager.getFile(`${blogId}/${key}`);

    return {
      body: file.Body,
      contentType: file.ContentType,
    };
  }

  async uploadFile(file: Express.Multer.File, blogId: string) {
    const path = `${blogId}/${encodeURI(file.originalname)}`;

    await this.fileManager.uploadFile(path, file.buffer, {
      ContentType: file.mimetype,
    });

    const url = `${process.env.UPLOAD_URL}/${path}`;

    return {
      url,
      thumbnail: url,
      raw: url,
    };
  }

  searchImages(query: string, page: string) {
    return this.unsplash.searchImages(query, page);
  }

  trackUnsplashImage(url: string) {
    return this.unsplash.trackImage(url);
  }
}
