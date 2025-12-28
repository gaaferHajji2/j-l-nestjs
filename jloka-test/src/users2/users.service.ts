import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersService {
  
  constructor(private eventEmitter: EventEmitter2) {}

  createUser(name: string, email: string) {
    // Simulate user creation
    const newUser = { id: Date.now(), name, email };

    // Emit 'user.created' event
    this.eventEmitter.emit('user.created', newUser);

    return newUser;
  }
}
