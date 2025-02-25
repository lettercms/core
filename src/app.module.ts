import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { ViewsModule } from './views/views.module';
import { ImagesModule } from './images/images.module';
import { InvitationsModule } from './invitations/invitations.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: () => ({
          context: 'HTTP',
        }),
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    AuthModule,
    BlogsModule,
    PostsModule,
    UsersModule,
    ViewsModule,
    ImagesModule,
    InvitationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
