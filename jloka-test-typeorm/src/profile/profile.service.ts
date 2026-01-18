import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(userId: string, createProfileDto: CreateProfileDto): Promise<ProfileResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    // Check if profile already exists
    const existingProfile = await this.profileRepository.findOne({
      where: { userId },
    });
    
    if (existingProfile) {
      throw new ConflictException('Profile already exists for this user');
    }
    
    const profile = this.profileRepository.create({
      ...createProfileDto,
      user,
      userId,
    });
    
    const savedProfile = await this.profileRepository.save(profile);
    
    return plainToInstance(ProfileResponseDto, savedProfile, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<ProfileResponseDto[]> {
    const profiles = await this.profileRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    
    return plainToInstance(ProfileResponseDto, profiles, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    
    return plainToInstance(ProfileResponseDto, profile, {
      excludeExtraneousValues: true,
    });
  }

  async findByUserId(userId: string): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
    
    if (!profile) {
      throw new NotFoundException(`Profile for user with ID ${userId} not found`);
    }
    
    return plainToInstance(ProfileResponseDto, profile, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateProfileDto: UpdateProfileDto): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    
    Object.assign(profile, updateProfileDto);
    
    const updatedProfile = await this.profileRepository.save(profile);
    
    return plainToInstance(ProfileResponseDto, updatedProfile, {
      excludeExtraneousValues: true,
    });
  }

  async updateByUserId(userId: string, updateProfileDto: UpdateProfileDto): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
    
    if (!profile) {
      throw new NotFoundException(`Profile for user with ID ${userId} not found`);
    }
    
    Object.assign(profile, updateProfileDto);
    
    const updatedProfile = await this.profileRepository.save(profile);
    
    return plainToInstance(ProfileResponseDto, updatedProfile, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<void> {
    const profile = await this.profileRepository.findOne({ where: { id } });
    
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    
    await this.profileRepository.remove(profile);
  }

  async removeByUserId(userId: string): Promise<void> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    
    if (!profile) {
      throw new NotFoundException(`Profile for user with ID ${userId} not found`);
    }
    
    await this.profileRepository.remove(profile);
  }

  async searchProfiles(searchTerm: string): Promise<ProfileResponseDto[]> {
    const profiles = await this.profileRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .where('profile.bio ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('profile.location ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('profile.website ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('user.email ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('user.firstName ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('user.lastName ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orderBy('profile.createdAt', 'DESC')
      .getMany();
    
    return plainToInstance(ProfileResponseDto, profiles, {
      excludeExtraneousValues: true,
    });
  }

}
