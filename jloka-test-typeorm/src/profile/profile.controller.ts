import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Post('/:userId')
    @HttpCode(HttpStatus.CREATED)
    public async createUserProfile(@Param('userId') userId, @Body() createProfileDto: CreateProfileDto) {
        return this.profileService.create(userId, createProfileDto)
    }

    @Get('/')
    @HttpCode(HttpStatus.OK)
    public async getAllProfileData() {
        return this.profileService.findAll()
    }

    @Get('/profile/:id')
    @HttpCode(HttpStatus.OK)
    public async getProfileById(@Param('id') id: string) {
        return this.profileService.findOne(id)
    }

    @Get('/user/:userId')
    @HttpCode(HttpStatus.OK)
    public async getProfileByUserId(@Param('userId') userId: string) {
        return this.profileService.findByUserId(userId)
    }

    @Put('/profile/:id')
    @HttpCode(HttpStatus.OK)
    public async updateProfileById(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto){
        return this.profileService.update(id, updateProfileDto)
    }

    @Put('/user/:userId')
    @HttpCode(HttpStatus.OK)
    public async updateProfileByUserId(@Param('userId') userId: string, @Body() updateProfileDto: UpdateProfileDto) {
        return this.profileService.updateByUserId(userId, updateProfileDto)
    }

    @Delete('/profile/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteProfileById(@Param('id') id: string) {
        return this.profileService.remove(id)
    }

    @Delete('/user/:userId')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteProfileByUserId(@Param('userId') userId: string) {
        return this.profileService.removeByUserId(userId)
    }
}
