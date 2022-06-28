import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Post } from './Entities/post.entity';
import { User } from './Entities/user.entity';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'rating',
      entities: [User, Post],
      synchronize: true,
      logging: true
    }),
    AuthModule, UserModule, PostModule, FileModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'static'),
    }),

  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
