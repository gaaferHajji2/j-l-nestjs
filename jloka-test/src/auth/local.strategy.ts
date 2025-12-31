import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

export class LocalStartegy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(username, password)
        if(!user) {
            throw new UnauthorizedException()
        }
        return user;
    }
}