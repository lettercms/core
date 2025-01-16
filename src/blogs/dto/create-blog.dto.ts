import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty()
  subdomain: string;

  @ApiProperty()
  title: string;
}

//subdomain: 'davidsdevel',
//thumbnail: 'https://cdn.jsdelivr.net/gh/lettercms/lettercms/apps/cdn/images/og-template.png',
//title: "David's Devel",
//userId: account.id
