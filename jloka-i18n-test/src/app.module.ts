import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { HeaderResolver, I18nJsonLoader, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: configService.get('NODE_ENV') === 'development',
        },
        formatter: (template, args) => template.replace(/\{\{(.*?)\}\}/g, (_, key) => args?.[key] || ''),
      }),
      loader: I18nJsonLoader,
      logging: true,
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale'] },
        new HeaderResolver(['x-custom-lang']),
      ],
      inject: [ConfigService],
      // Optional: Format validation errors consistently
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
