import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) {}

    async signIn(username: string, pass: string) {
        const user = await this.usersService.findOne(username)

        if(user.password !== pass) {
            throw new UnauthorizedException();
        }

        return user
    }
}
