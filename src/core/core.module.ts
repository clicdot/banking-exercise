import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerModule } from 'nestjs-pino';
import { MongoosedbModule } from './db/mongoose/mongoosedb.module';
import { ResponseService } from './services/response/response.service';

import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { VersionHealthIndicator } from './healthcheck/services/version-health-check.service';
import { ShutdownService } from './services/shutdown/shutdown.service';
import { OrmModule } from './orm/orm.module';

@Module({})
export class CoreModule {
  static async forRoot(): Promise<DynamicModule> {
    return {
      module: CoreModule,
      global: true,
      imports: [
        LoggerModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async () => {
            return {
              pinoHttp: {
                level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
                prettyPrint: true,
                colorize: true
              }
            };
          }
        }),
        JwtModule.register({
          publicKey: process.env.PUBLIC_KEY
        }),
        TerminusModule,
        MongoosedbModule,
        OrmModule
      ],
      controllers: [HealthcheckController],
      providers: [ShutdownService, ResponseService, VersionHealthIndicator],
      exports: [JwtModule, LoggerModule, MongoosedbModule, ResponseService]
    };
  }

  static async forTesting(): Promise<DynamicModule> {
    return {
      module: CoreModule,
      global: true,
      controllers: [],
      providers: [],
      exports: [],
      imports: []
    };
  }
}
