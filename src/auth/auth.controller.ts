import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('register')
    async register(@Body() dto: CreateUserDto) {

        return this.authService.register(dto)
    }

    @Post('login')
    async login(@Body() dto: LoginUserDto, @Res({ passthrough: true }) response: Response) {

        await this.authService.login(dto, response)

        return {
            message: 'success'
        };
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response) {

        response.clearCookie('jwt');

        return {
            message: 'success'
        }
    }
}