import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { Response } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
        private userService: UserService
    ) {
    }

    async register(dto: CreateUserDto) {
        const applicant = await this.userRepository.findOne({ where: { email: dto.email } })
        if (applicant !== null) throw new HttpException('Пользователь с такой почтой уже существует', HttpStatus.BAD_REQUEST);

        await this.userService.create({
            name: dto.name,
            email: dto.email,
            password: dto.password
        });

        return {
            message: 'succes register'
        };
    }

    async login(dto: LoginUserDto, response: Response) {
        const user = await this.userRepository.findOne({ where: { email: dto.email } });

        if (!user) {
            throw new BadRequestException('invalid credentials');
        }

        if (!await bcrypt.compare(dto.password, user.password)) {
            throw new BadRequestException('invalid credentials');
        }

        const jwt = await this.jwtService.signAsync({ id: user.id, role: user.role });

        response.cookie('jwt', jwt, { httpOnly: true, secure: true });
    }

    verify(token) {
        return this.jwtService.verify(token)
    }
}

