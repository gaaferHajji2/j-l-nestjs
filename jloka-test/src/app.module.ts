import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CatsModule } from './cats/cats.module';
import { CatsMiddleware } from './cats/cats.middleware';

@Module({
  imports: [UsersModule, EventEmitterModule.forRoot(), CatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(CatsMiddleware).forRoutes('cats')
    consumer.apply(CatsMiddleware).forRoutes({ path: 'cats', method: RequestMethod.GET })
  }
}
