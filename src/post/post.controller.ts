import { Body, Controller, Delete, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { EvaluationDto } from './dto/evaluation.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    constructor(private postService: PostService) { }

    @Post('create')
    @UseInterceptors(FileInterceptor('file'))
    create(@UploadedFile() file: Express.Multer.File, @Body() dto: CreatePostDto, @Req() req: Request) {
        return this.postService.create(dto, req, file);
    }

    @Post('evaluation')
    @Roles("MODER")
    @UseGuards(RolesGuard)
    evaluation(@Body() dto: EvaluationDto) {
        return this.postService.evaluation(dto);
    }

    @Delete('delete/:id')
    delete(@Param('id') id: number, @Req() req: Request) {
        return this.postService.delete(id, req)
    }
}
