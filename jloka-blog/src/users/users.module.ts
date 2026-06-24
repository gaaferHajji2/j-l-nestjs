import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  // eslint-disable-next-line prettier/prettier
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // this service become available to use by other modules
  imports: [forwardRef(() => AuthModule)],
})
export class UsersModule {}
