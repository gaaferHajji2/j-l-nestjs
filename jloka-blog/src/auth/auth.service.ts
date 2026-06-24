/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService
    ) {}

    public login(email: string, password: string, id: string) {
        const user = this.usersService.getUserById(parseInt(id));
        return {
            user,
            token: "123456789",
            email,
            password
        }
    }

    public isAuth() {
        return true
    }

}
