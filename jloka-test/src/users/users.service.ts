import { Injectable } from '@nestjs/common';

// for real scenarios we must declare it using classes with class-validator
export type User = any;

@Injectable()
export class UsersService {

    private readonly users = [
    {
      userId: 1,
      username: 'Jafar',
      password: 'Loka',
    },
    {
      userId: 2,
      username: 'Maria',
      password: 'Loka',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

}
