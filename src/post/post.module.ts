import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Post } from 'src/Entities/post.entity';
import { User } from 'src/Entities/user.entity';
import { FileModule } from 'src/file/file.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [TypeOrmModule.forFeature([Post, User]), AuthModule, FileModule]
})
export class PostModule { }
