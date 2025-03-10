import { Injectable, NotFoundException } from '@nestjs/common';
import { createPaginator } from 'prisma-pagination';

interface FindOptions {
  where?: Record<string, any>;
  select?: string;
  include?: string;
}

interface PaginationOptions extends FindOptions {
  limit?: string | number;
  page?: string | number;
  orderBy?: string;
  sort?: 'asc' | 'desc';
}

@Injectable()
export class ModelManagerService {
  paginate<Entity>(model: any, options: PaginationOptions) {
    const args = this.genetareFilter(options);

    if (options.orderBy) {
      args.orderBy = {
        [options.orderBy]: options.sort || 'desc',
      };
    }

    const paginate = createPaginator({
      perPage: options.limit || 10,
      page: options.page || 1,
    });

    return paginate<Entity, Record<string, any>>(model, args);
  }

  async findOne<Entity>(model: any, options: FindOptions) {
    const args = this.genetareFilter(options);

    const data = (await model.findFirst(args)) as Promise<Entity> | null;

    if (!data) {
      throw new NotFoundException('No se encontro el recurso solicitado');
    }

    return data;
  }

  private generateOptionsByString(select: string): Record<string, boolean> {
    const options = select.split(',');

    return options.reduce((acc, option) => {
      acc[option] = true;
      return acc;
    }, {});
  }

  private genetareFilter(options: FindOptions | PaginationOptions) {
    const args: Record<string, any> = {
      where: options.where,
    };

    if (options.select) {
      args.select = this.generateOptionsByString(options.select);
    }

    if (options.include) {
      args.include = this.generateOptionsByString(options.include);
    }

    return args;
  }
}
