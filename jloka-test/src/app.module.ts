import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users2/users.module';
import { CatsModule } from './cats/cats.module';
// import { CatsMiddleware } from './cats/cats.middleware';
import { logger } from './cats/cats.middleware';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, EventEmitterModule.forRoot(), CatsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(CatsMiddleware).forRoutes('cats')
    // consumer.apply(CatsMiddleware).forRoutes({ path: 'cats', method: RequestMethod.GET })
    consumer.apply(logger).forRoutes({ path: 'cats', method: RequestMethod.GET })
  }
}
