import { createConnection, ConnectionOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { seedData } from './accounts-seed-data';
import { AccountEntity } from '../src/api/v1/modules/banking/models/entities';
import { AccountsDto } from '../src/api/v1/modules/banking/models/dtos';

const data = seedData;
dotenv.config();

async function run() {
  console.log('Seed Job Started...');
  const dbConfig = new ConfigService();

  const configService = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: dbConfig.get<any>('POSTGRES_USER'),
    password: dbConfig.get<any>('POSTGRES_PASSWORD'),
    database: dbConfig.get<any>('POSTGRES_DB'),
    entities: [AccountEntity],
    synchronize: true,
    ssl: false
  };

  const opt = {
    ...configService,
    debug: true
  };

  const connection = await createConnection(opt as ConnectionOptions);

  const work = data
    .map((n) => AccountsDto.toEntity(n, n.user))
    .map((dto) =>
      connection
        .getRepository(AccountEntity)
        .save(AccountsDto.toEntity(dto, dto.user))
    );

  return await Promise.all(work);
}

run()
  .then((_) => console.log('...wait for script to exit'))
  .catch((error) => console.error('seed error', error));
