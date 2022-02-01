import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class InterceptorHelperService {
  private readonly logger: Logger = new Logger(InterceptorHelperService.name);

  // constructor() {}
}
