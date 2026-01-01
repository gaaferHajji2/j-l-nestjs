import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { AuthGuard } from './auth.guard';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @UseGuards(PassportAuthGuard('local'))
    @Post('passport/login')
    async login(@Request() req) {
        return req.user
    }

    @UseGuards(AuthGuard)
    @Get("profile")
    async profile(@Request() req) {
        return req.user
    }
}