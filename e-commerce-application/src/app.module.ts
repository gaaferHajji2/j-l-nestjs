import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from './shared/infrastructure/database/mongodb/mongo.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
