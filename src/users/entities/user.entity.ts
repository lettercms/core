import { ApiProperty } from '@nestjs/swagger';
import { User, CollaboratorsOnBlogs } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  ocupation: string;

  @ApiProperty()
  profilePicture: string;

  @ApiProperty()
  verified: boolean;

  @ApiProperty()
  externalBlogs: CollaboratorsOnBlogs[];

  @ApiProperty()
  website: string;

  @ApiProperty()
  facebook: string;

  @ApiProperty()
  twitter: string;

  @ApiProperty()
  instagram: string;

  @ApiProperty()
  linkedin: string;
  password: string;
}
