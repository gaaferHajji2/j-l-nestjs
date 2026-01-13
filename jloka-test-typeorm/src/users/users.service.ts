import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DataSource, DeleteResult, Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private dataSource: DataSource
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

    async createMany(users: User[]) {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            await queryRunner.manager.save(users[0])
            await queryRunner.manager.save(users[1])
            await queryRunner.commitTransaction()
        } catch (e) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }
}