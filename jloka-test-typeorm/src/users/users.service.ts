import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    async findAll():Promise<User[]> {
        return this.userRepository.find()
    }

    async findOne(id: number) :Promise<User | null> {
        return this.userRepository.findOneBy({ id })
    }

    async remove(id: number): Promise<DeleteResult> {
        return this.userRepository.delete(id)
    }
}
