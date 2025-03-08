import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private redis = createClient({
    url: process.env.REDIS_URL,
  });

  async onModuleInit() {
    await this.redis.connect();
  }

  async incrementBlogViews(blog) {
    await this.redis.incr(`blog:${blog}`);
  }

  async incrementSlugViews(blog, slug) {
    await this.redis.incr(`slug:${blog}:${slug}`);
  }

  async incrementCountryViews(blog, country) {
    await this.redis.incr(`country:${blog}:${country}`);
  }

  async incrementDeviceViews(blog, device) {
    await this.redis.incr(`device:${blog}:${device}`);
  }

  async incrementPlatformViews(blog, platform) {
    await this.redis.incr(`platform:${blog}:${platform}`);
  }

  async incrementBrowserViews(blog, browser) {
    await this.redis.incr(`browser:${blog}:${browser}`);
  }
}
