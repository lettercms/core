import { Injectable } from '@nestjs/common';
import {
  S3Client,
  HeadObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  PutObjectCommandInput,
  GetObjectCommand,
  S3ClientConfig,
  GetObjectCommandInput,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs';

@Injectable()
export class FileManagerService {
  clientConfig: S3ClientConfig = {
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  };
  client = new S3Client(this.clientConfig);
  bucket = process.env.AWS_BUCKET;

  getFiles(prefix, options = {}) {
    const input: ListObjectsV2CommandInput = {
      ...options,
      Bucket: this.bucket,
      Delimiter: '/',
      MaxKeys: 20,
    };

    if (prefix !== '') {
      input.Prefix = `${prefix}/`;
    }

    return this.client.send(new ListObjectsV2Command(input));
  }

  uploadFile(Key: string, Body: string | Buffer, options = {}) {
    const params: PutObjectCommandInput = {
      ...options,
      Key,
      Bucket: this.bucket,
    };

    if (typeof Body === 'string') {
      params.Body = fs.createReadStream(Body);
    } else {
      params.Body = Body;
    }

    const upload = new Upload({
      client: this.client,
      params,
    });

    // upload.on("httpUploadProgress", (progress: ProgressEvent) => {
    //  console.log(progress);
    // });

    return upload.done();
  }

  async deleteFile(Key: string) {
    const input = {
      Bucket: this.bucket,
      Key,
    };

    try {
      const objectMeta = await this.client.send(new HeadObjectCommand(input));

      if (!objectMeta) {
        return null;
      }
    } catch (err) {
      if (err.name === 'NotFound') return Promise.resolve(null);
    }

    return this.client.send(new DeleteObjectCommand(input));
  }

  async existsFile(Key: string) {
    try {
      const input = {
        Bucket: this.bucket,
        Key,
      };

      const objectMeta = await this.client.send(new HeadObjectCommand(input));

      return !!objectMeta;
    } catch (err) {
      if (err.name === 'NotFound') return Promise.resolve(false);
    }
  }

  getFile(Key: string) {
    const input: GetObjectCommandInput = {
      Bucket: this.bucket,
      Key,
    };

    console.log(input);

    return this.client.send(new GetObjectCommand(input));
  }
}
