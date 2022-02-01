import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  Logger
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiConstants } from '../constants/api.constants';

@Injectable()
export class OnRequestMiddleware implements NestMiddleware {
  private readonly logger = new Logger(OnRequestMiddleware.name);

  constructor(private jwtservice: JwtService) {}

  async use(req: FastifyRequest, reply: FastifyReply, next): Promise<void> {
    this.logger.log('Request...');

    try {
      const url = req.url;
      let runAuthCheck = true;
      const excludedRoutes = ApiConstants.excludedEndpoints;

      excludedRoutes.forEach((route: any) => {
        if (url.includes(route)) {
          runAuthCheck = false;
        }
      });

      // if (runAuthCheck && req.method.toLowerCase() !== 'options') {
      //   if (req.headers.authorization) {
      //     const s = await this.jwtservice.verifyAsync(
      //       req.headers.authorization.split(' ')[1]
      //     );

      //     ApiConstants.SANDBOX = s?.sandbox || false;

      //     ApiConstants.DEBUG = s?.debug || false;
      //   } else {
      //     throw new UnauthorizedException('No Signed JWT');
      //   }
      // }

      next();
    } catch (error) {
      next(
        new UnauthorizedException(`Authorization Error: ${error.message}`),
        reply
      );
    }
  }
}
