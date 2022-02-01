import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  BadRequestException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { ApiConstants } from '../constants/api.constants';
import { InterceptorHelperService } from './helpers/interceptor-helper.service';

export interface Response {
  response: any;
  data: any;
}

interface JWT {
  company: string;
  sessionId: string;
  encryption: boolean;
  scope: string[];
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<Response> {
  private readonly ctxPrefix: string = 'DataInterceptor';
  private readonly logger: Logger = new Logger(this.ctxPrefix);

  constructor(
    private readonly jwtService: JwtService,
    private readonly __helper: InterceptorHelperService
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const reply = ctx.getResponse();
    const excludedRoutes = [
      '/api/v1/security/encrypt',
      '/api/v1/security/decrypt',
      '/api/healthcheck',
      '/swagger/'
    ];
    let jwt: JWT;

    reply.header('Cache-Control', 'no-cache, no-store, max-age=0');
    reply.header('Pragma', 'no-cache');
    reply.header('Expires', '-1');
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

    // if (request.headers.authorization) {
    //   jwt = this.jwtService.decode(
    //     request.headers.authorization.split(' ')[1],
    //     {
    //       json: true
    //     }
    //   ) as any;
    // }

    const version = request.raw.url.split('/')[2];

    const now = Date.now();
    return next.handle().pipe(
      map(async (data) => {
        const result = {
          response: {
            code: reply.statusCode,
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            function: {
              method: request.raw.method,
              url: request.raw.url,
              version,
              ip: request.ip
            },
            responseTime: `${Date.now() - now}ms`
          },
          data
        };

        return result;
      })
    );
  }
}
