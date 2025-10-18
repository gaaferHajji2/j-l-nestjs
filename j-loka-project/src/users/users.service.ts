/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    
    private users = [
        {id: 1, name: 'JLoka-01', email: 'jloka1@jloka.com'},
        {id: 2, name: 'JLoka-02', email: 'jloka2@jloka.com'},
        {id: 3, name: 'JLoka-03', email: 'jloka3@jloka.com'},
    ];

    public getAllUsers() {
        return this.users;
    }

    public getUserById(id: number) {
        const user = this.users.find(e => e.id == id);

        if(user == undefined) {
            return {}
        }

        return user;
    }

}
