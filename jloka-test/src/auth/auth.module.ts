import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { jwtConstants } from './constants';
import { LocalStartegy } from './local.strategy'

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStartegy],
  imports: [UsersModule, JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '3600s' }
  }), PassportModule],
  exports: [AuthService],
})
export class AuthModule {}
