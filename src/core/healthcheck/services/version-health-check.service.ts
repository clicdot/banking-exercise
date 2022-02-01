import { ApiConstants } from '../../constants/api.constants';
import { Injectable, BadRequestException } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
const dir = process.cwd();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PKG = require(`${dir}/package.json`);

@Injectable()
export class VersionHealthIndicator extends HealthIndicator {
  version = PKG.version;

  constructor() {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const health: any = {
      version: this.version
    };
    if (ApiConstants.DEBUG) {
      health.ENV = {
        idemia: process.env.IDEMIA_HOST,
        onfido: process.env.ONFIDO_HOST,
        plaid: process.env.PLAID_HOST
      };
    }
    const result = this.getStatus(key, this.version ? true : false, health);
    if (this.version) {
      return result;
    }
    throw new BadRequestException('Redis failed');
  }
}
