import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AcceptLanguageResolver,  I18nJsonLoader, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // I18nModule.forRootAsync({
    //   useFactory: (configService: ConfigService) => ({
    //     fallbackLanguage: 'en',
    //     loaderOptions: {
    //       path: join(__dirname, '/i18n/'),
    //       watch: configService.get('NODE_ENV') === 'development',
    //     },
    //     formatter: (template, args) => template.replace(/\{\{(.*?)\}\}/g, (_, key) => args?.[key] || ''),
    //   }),
    //   loader: I18nJsonLoader,
    //   logging: true,
    //   resolvers: [
    //     { use: QueryResolver, options: ['lang', 'locale'] },
    //     AcceptLanguageResolver
    //   ],
    //   inject: [ConfigService],
    //   // Optional: Format validation errors consistently
    // }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule{}
