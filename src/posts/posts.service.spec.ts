import { Test, type TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { PostsService } from './posts.service';
import { PrismaModule } from '../prisma.module';

describe('PostsService', () => {
  let service: PostsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<PostsService>(PostsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get the first job for "steve"', async () => {
    //Use `jest.fn()` to mock the specific Prisma function that is used in the function under test (`getFirstJob()`). This will cause the next call to `prisma.name.findMany()` to return the data we've provided. The actual database won't be accessed.
    const now = new Date();

    /*prisma.post.findMany = jest.fn().mockReturnValueOnce([
			{
				blogId: '1',
				category: '',
				content: '',
				created: now,
				description: 'string',
				id: 'string',
				images: [],
				protected: false,
				published: now,
				slug: 'string',
				status: 'DRAFTED',
				tags: [],
				text: 'string',
				thumbnail: 'string',
				title: 'string',
				updated: now,
				userId: 'string',
				views: 0,
			}
		]);*/

    //Check the return value of our function
    const { data, meta } = await service.findAll('blog');

    expect(data).toBeInstanceOf(Array);
    expect(meta).toMatchObject({
      total: 1,
      page: 1,
      lastPage: 0,
      perPage: 10,
      currentPage: 1,
      prev: null,
      next: null,
    });

    //Above, we use `mockReturnValueOnce()` to manually specify what the database query would return. This is great, but what happens if the actual query used in `getFirstJob()` changes? We would expect the result of `getFirstJob()` to change, too. But since we've hard-wired the result of the database query, this won't happen. To alert us in case the query does change, we use a custom matcher to verify that the underlying query hasn't changed.
    //expect(prisma.name.findMany).toHaveBeenCalledWithObjectMatchingHash('db0110285c148c77943f996a17cbaf27');
  });
});
