import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UserCreatedListener {
  private readonly logger = new Logger(UserCreatedListener.name);

  @OnEvent('user.created')
  handleUserCreated(user: any) {
    // This runs asynchronously by default
    this.logger.log(`New user created: ${user.name} <${user.email}>`);
    
    // Example: Send welcome email, update analytics, etc.
  }
}
