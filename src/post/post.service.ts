import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { Post } from 'src/Entities/post.entity';
import { User } from 'src/Entities/user.entity';
import { FileService } from 'src/file/file.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { EvaluationDto } from './dto/evaluation.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post) private postRepository: Repository<Post>,
        @InjectRepository(User) private userRepository: Repository<User>,
        private authService: AuthService,
        private fileService: FileService
    ) { }


    async create(dto: CreatePostDto, req: Request, file: Express.Multer.File) {
        const token = req.cookies['jwt']
        const jwtUser = await this.authService.verify(token)
        const fileName = this.fileService.createFile(file)
        const post = new Post();
        post.title = dto.title
        post.description = dto.description
        post.file = fileName
        post.user = jwtUser

        await this.postRepository.save(post)
        return { message: 'succes' };
    }

    async evaluation(dto: EvaluationDto) {
        const post = await this.postRepository.findOne({ where: { id: dto.postId }, relations: { user: true } })
        let points = 0;
        dto.quests.forEach((i) => {
            points += i.point
        })
        post.points = points
        await this.postRepository.save(post)
        return;
    }

    async delete(id: number, req: Request) {
        const token = req.cookies['jwt']
        const jwtUser = await this.authService.verify(token)
        const post = await this.postRepository.findOne({ where: { id }, relations: { user: true } })
        const user = await this.userRepository.findOne({ where: { id: jwtUser.id } })
        console.log(user)
        console.log(post.user)
        console.log(post.user.id === user.id)
        // const post2 = await this.postRepository.createQueryBuilder("post")
        //                                         .leftJoinAndSelect("post.user", "user")
        //                                         .where("post.id = :id", { id: dto.postId })
        //                                         .getOne()

        // // console.log(post2)
        // const user = req.cookies;
        // const verif = await this.authService.verify(user['jwt'])
        // // const post2 = await this.postRepository.findOne({where: {user: verif.id}, relations: {user: true}})
        // // console.log(post.user === post2.user)
        // // console.log(post.user)
        // // console.log(post2.user)

        // const f = await this.userRepository.createQueryBuilder("user")
        // .leftJoinAndSelect("user.posts", "post")
        // .where("user.id = :id", { id: verif.id })
        // .getOne()
        // // console.log(f.posts)
        // let i = 0;
        // while(i < f.posts.length) {
        //     if(f.posts[i].id === dto.postId) {
        //         console.log('Это его пост')
        //         return true;
        //     }
        //     console.log('ne ego')
        //     i++
        // }

        // this.postRepository.delete({id})
        return {
            message: 'succes'
        }
    }
}
