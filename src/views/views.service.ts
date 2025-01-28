import { Injectable } from '@nestjs/common';
import { PostsService } from 'src/posts/posts.service';
import { PrismaService } from 'src/prisma.service';
import * as countries from 'i18n-iso-countries';

@Injectable()
export class ViewsService {
  constructor(
    private prisma: PrismaService,
    private postService: PostsService,
  ) {}
  async registerView(
    blog: string,
    slug: string,
    source: string,
    country: string,
    device: string,
    browser: string,
    platform: string,
  ) {
    await this.postService.incrementView(blog, slug);

    await this.prisma.view.create({
      data: {
        source,
        browser,
        country,
        slug,
        platform,
        device,
        blog: {
          connect: {
            id: blog,
          },
        },
      },
    });

    return {
      status: 'OK',
      message: 'View registered successfully',
    };
  }

  async getViews(blog: string, start: number, end: number) {
    if (!start) {
      start = Date.now() - 1000 * 60 * 60 * 24 * 7;
    }
    if (!end) {
      end = Date.now();
    }

    const { dateEnd, dateStart, diff } = this.generateRanges(start, end);

    const dates = this.generateDates(diff, dateEnd - 1000 * 60 * 60 * 24);

    const data = {
      countries: {},
      devices: {},
      browsers: {},
      slugs: {},
      hours: {
        '1AM': 0,
        '2AM': 0,
        '3AM': 0,
        '4AM': 0,
        '5AM': 0,
        '6AM': 0,
        '7AM': 0,
        '8AM': 0,
        '9AM': 0,
        '10AM': 0,
        '11AM': 0,
        '12M': 0,
        '1PM': 0,
        '2PM': 0,
        '3PM': 0,
        '4PM': 0,
        '5PM': 0,
        '6PM': 0,
        '7PM': 0,
        '8PM': 0,
        '9PM': 0,
        '10PM': 0,
        '11PM': 0,
        '12AM': 0,
      },
      days: {
        domingo: 0,
        lunes: 0,
        martes: 0,
        miercoles: 0,
        jueves: 0,
        viernes: 0,
        sabado: 0,
      },
      dates,
      sources: {},
    };

    const views = await this.prisma.view.findMany({
      where: {
        blogId: blog,
        created: {
          gte: new Date(dateStart),
          lte: new Date(dateEnd),
        },
      },
    });

    views.forEach((e) => {
      const dateString = this.getDateString(e.created);
      const dayString = this.getWeekDay(e.created);
      const hourString = this.getHour(e.created);

      if (!data.dates[dateString]) {
        data.dates[dateString] = 0;
      }
      if (!data.hours[hourString]) {
        data.hours[hourString] = 0;
      }
      if (!data.days[dayString]) {
        data.days[dayString] = 0;
      }

      if (!data.dates[dateString]) {
        data.dates[dateString] = 0;
      }
      if (!data.browsers[e.browser]) {
        data.browsers[e.browser] = 0;
      }
      if (!data.countries[e.country]) {
        data.countries[e.country] = 0;
      }
      if (!data.devices[e.device]) {
        data.devices[e.device] = 0;
      }
      if (!data.sources[e.source]) {
        data.sources[e.source] = 0;
      }
      if (!data.slugs[e.slug]) {
        data.slugs[e.slug] = 0;
      }

      data.browsers[e.browser] += 1;
      data.countries[e.country] += 1;
      data.devices[e.device] += 1;
      data.sources[e.source] += 1;
      data.slugs[e.slug] += 1;
      data.dates[dateString] += 1;
      data.days[dayString] += 1;
      data.hours[hourString] += 1;
    });

    data.countries = Object.entries(data.countries).map(([code, views]) => {
      const alpha3 = countries.alpha2ToAlpha3(code) ?? 'Unknown';
      const name = countries.getName(code, 'es') ?? 'Unknown';

      return {
        alpha3,
        views,
        name,
        code,
      };
    });

    return data;
  }
  private generateDates(daysCount: number, dateEnd: number) {
    const dates: Record<string, number> = {};

    for (let i = Math.floor(daysCount); i >= 0; i -= 1) {
      const path = this.getDateString(dateEnd - (i - 1) * 1000 * 60 * 60 * 24);

      dates[path] = 0;
    }

    return dates;
  }

  private getDateString(dateConfig: Date | number | string) {
    const time = dateConfig instanceof Date ? dateConfig : new Date(dateConfig);

    const month = time.getMonth() + 1;
    const date = time.getDate();

    return `${time.getFullYear()}-${month < 10 ? `0${month}` : month}-${date < 10 ? `0${date}` : date}`;
  }

  private getHour(dateConfig: Date | number | string) {
    const time = dateConfig instanceof Date ? dateConfig : new Date(dateConfig);

    const hours = time.getHours();

    if (hours < 12) return `${hours}AM`;
    else if (hours === 12) return `${hours}M`;
    else if (hours > 12) return `${hours - 12}PM`;
    else if (hours === 0) return '12AM';
  }

  private getWeekDay(dateConfig: Date | number | string) {
    const time = dateConfig instanceof Date ? dateConfig : new Date(dateConfig);

    const day = time.getDay();

    const dayNames = [
      'domingo',
      'lunes',
      'martes',
      'miercoles',
      'jueves',
      'viernes',
      'sabado',
    ];

    return dayNames[day];
  }
  private generateRanges(start: number, end: number) {
    if (!start) start = Date.now() - 1000 * 60 * 60 * 24 * 30;
    if (!end) end = Date.now();

    return {
      dateEnd: end,
      dateStart: start,
      diff: (end - start) / (1000 * 60 * 60 * 24),
    };
  }
}
