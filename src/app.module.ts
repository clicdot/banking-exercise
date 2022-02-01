import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
// import { I18nModule, I18nJsonParser } from 'nestjs-i18n';
import { TerminusModule } from '@nestjs/terminus';
import { OnRequestMiddleware } from './core/middleware/on-request.middleware';
import { V1Module } from './api/v1/v1.module';

import { MongoosedbModule } from './core/db/mongoose/mongoosedb.module';
import { CoreModule } from './core/core.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './core/interceptor/transform.interceptor';
import { InterceptorHelperService } from './core/interceptor/helpers/interceptor-helper.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true
    }),
    MongoosedbModule,
    TerminusModule,
    V1Module,
    CoreModule.forRoot()
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    },
    InterceptorHelperService
  ],
  exports: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OnRequestMiddleware).forRoutes('/');
  }
}
