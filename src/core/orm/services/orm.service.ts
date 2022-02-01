import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  TransactionsEntity,
  AccountEntity,
  RefundsEntity
} from '../../../api/v1/modules/banking/models/entities';

@Injectable()
export class OrmService implements TypeOrmOptionsFactory {
  private readonly logger = new Logger(OrmService.name);

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    // let config;

    // const Account = process.env.TEST ? AccountEntityTest : AccountEntity;
    // const Transaction = process.env.TEST
    //   ? TransactionsEntityTest
    //   : TransactionsEntity;

    return {
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [AccountEntity, TransactionsEntity, RefundsEntity],
      synchronize: true,
      ssl: false
    };
  }
}
