import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { Profile } from 'src/profile/profile.entity';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        private dataSource: DataSource
    ) {}

    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    
    // Create profile along with user
    if (createUserDto.profile) {
      user.profile = this.profileRepository.create(createUserDto.profile);
    }
    
    return await this.userRepository.save(user);
  }

    async findAll():Promise<User[]> {
        return this.userRepository.find()
    }

    async findOne(id: string) :Promise<User | null> {
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