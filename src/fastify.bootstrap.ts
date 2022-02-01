import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';
import helmet from 'fastify-helmet';
import compression from 'fastify-compress';
import { AppModule } from './app.module';
import { GlobalInterceptor } from './core/interceptor/global.interceptor';
import { TransformInterceptor } from './core/interceptor/transform.interceptor';
import { ErrorsInterceptor } from './core/interceptor/errors.interceptor';
import { HttpExceptionFilter } from './core/filters/errors.exception.filter';
import { ResponseService } from './core/services/response/response.service';

const helmetPolicy =
  process.env.ENV === 'PROD'
    ? {}
    : {
        contentSecurityPolicy: false
      };

export async function start(): Promise<NestFastifyApplication> {
  const responseSet = new ResponseService();

  const app: NestFastifyApplication =
    await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({
        logger: true,
        //   level: 'info'
        // },
        bodyLimit: 24971520
      })
    );

  app.useLogger(app.get(Logger));

  app.get(ConfigService);

  app.enableCors();

  if (process.env.MODE !== 'LOCAL') {
    app.enableShutdownHooks();
  }

  app.register(helmet, helmetPolicy);
  app.register(compression, { encodings: ['gzip', 'deflate'] });

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter(responseSet));
  app.useGlobalInterceptors(new GlobalInterceptor());
  // app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new ErrorsInterceptor());

  // Swagger Docs
  const options = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE)
    .setDescription(process.env.SWAGGER_DESCR)
    .setVersion(process.env.SWAGGER_VS)
    .addTag('Swagger')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  return app;
}
