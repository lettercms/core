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
import newrelicFormatter from '@newrelic/pino-enricher';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport: {
          target: 'pino-pretty', // Optional: For pretty-printing in development
          options: {
            singleLine: true,
          },
        },
        formatters: {
          level: (label) => {
            return { level: label };
          },
        },
        redact: ['req.headers.authorization', 'res.headers.authorization'],
        mixin: newrelicFormatter,
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
