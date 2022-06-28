import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    async create(dto: CreateUserDto) {
        const hashedPassword = bcrypt.hashSync(dto.password, 12);
        const user = await this.userRepository.save({
            name: dto.name,
            email: dto.email,
            password: hashedPassword
        })
        return user;
    }
}
