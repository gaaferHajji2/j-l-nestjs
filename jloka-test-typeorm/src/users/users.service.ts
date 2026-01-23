import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { Profile } from 'src/profile/profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private dataSource: DataSource
  ) { }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user with email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    return await this.dataSource.transaction(async (transactionalEntityManager) => {
      const user = this.userRepository.create(createUserDto);

      // Create profile if provided
      if (createUserDto.profile) {
        const profile = this.profileRepository.create(createUserDto.profile);
        user.profile = profile;
      }

      const savedUser = await transactionalEntityManager.save(user);

      // Load with relations
      const userWithRelations = await transactionalEntityManager.findOne(User, {
        where: { id: savedUser.id },
        relations: ['profile', 'posts'],
      });

      return plainToInstance(UserResponseDto, userWithRelations, {
        excludeExtraneousValues: true,
      });
    });
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      relations: ['profile'],
      order: { createdAt: 'DESC' },
    });

    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'posts'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // console.log(`The user email is: ${user.email}`)
    // console.log(`The updated user email is: ${updateUserDto.email}`)

    // Check email uniqueness if email is being updated
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      
      // console.log(`The existing user is: ${existingUser}`)

      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }

    // Update user fields
    Object.assign(user, updateUserDto);

    // Update profile if provided
    if (updateUserDto.profile && user.profile) {
      Object.assign(user.profile, updateUserDto.profile);
    }
    // here we must call the profile repository for updating
    const updatedUser = await this.userRepository.save({...user, profile: user.profile});

    // Reload with relations
    const userWithRelations = await this.userRepository.findOne({
      where: { id: updatedUser.id },
      relations: ['profile', 'posts'],
    });

    return plainToInstance(UserResponseDto, userWithRelations, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.remove(user);
  }

  async searchUsers(searchTerm: string): Promise<UserResponseDto[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      // .leftJoinAndSelect('user.profile', 'profile')
      .where('LOWER(user.email) LIKE :searchTerm', { searchTerm: `%${searchTerm.toLowerCase()}%` })
      .orWhere('LOWER(user.firstName) LIKE :searchTerm', { searchTerm: `%${searchTerm.toLowerCase()}%` })
      .orWhere('LOWER(user.lastName) LIKE :searchTerm', { searchTerm: `%${searchTerm.toLowerCase()}%` })
      // .orWhere('profile.bio ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orderBy('user.createdAt', 'DESC')
      .getMany();

    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
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