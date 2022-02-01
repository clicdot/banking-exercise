import { Injectable, Logger } from '@nestjs/common';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions
} from '@nestjs/mongoose';
import { ApiConstants } from '../../constants/api.constants';
import * as fs from 'fs-extra';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  private readonly logger = new Logger(MongooseConfigService.name);

  createMongooseOptions(): MongooseModuleOptions {
    let mongooseConfig =
      process.env.MONGODB_URI ||
      `mongodb://${process.env.MONGOOSEHOST}:${process.env.MONGOOSEPORT}/${process.env.MONGOOSEDB}`;

    if (ApiConstants.MONGOOSETLSCERT) {
      mongooseConfig = `mongodb://${process.env.MONGOOSEUSER}:${process.env.MONGOOSEPASS}@${process.env.MONGOOSEHOST}:${process.env.MONGOOSEPORT}/${process.env.MONGOOSEDB}?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`;

      this.logger.log(
        'MONGOOSEAWSSETTING',
        mongooseConfig,
        `${process.cwd()}/docker/aws/rds-combined-ca-bundle.pem`
      );
    }

    return {
      uri: mongooseConfig
    };
  }
}
