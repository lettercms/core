import { Blog } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

export class BlogEntity implements Blog {
  id: string;
  subdomain: string;
  created: Date;
  custonDomain: string;
  description: string;
  hasCustomRobots: boolean;
  isVisible: boolean;
  keys: JsonValue[];
  robots: string;
  thumbnail: string;
  title: string;
  userId: string;
  posts: number;
  users: number;
  visits: number;
}
