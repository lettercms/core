import { Test, type TestingModule } from '@nestjs/testing';
import { BlogsService } from './blogs.service';
import { PrismaModule } from '../prisma.module';

describe('BlogsService', () => {
  let service: BlogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogsService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<BlogsService>(BlogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
