import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './controllers/transactions.controller';
import { RefundsController } from './controllers/refunds.controller';
import { RefundsService } from './services/refunds.service';
import { TransactionsService } from './services/transactions.service';
import { AccountsController } from './controllers/accounts.controller';
import { AccountsService } from './services/accounts.service';
import { HelpersService } from './services/helpers/helpers.service';
import {
  AccountEntity,
  RefundsEntity,
  TransactionsEntity
} from './models/entities';

// const Account = process.env.TEST ? AccountEntityTest : AccountEntity;
// const Transaction = process.env.TEST
//   ? TransactionsEntityTest
//   : TransactionsEntity;

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity, TransactionsEntity, RefundsEntity])
  ],
  controllers: [AccountsController, RefundsController, TransactionsController],
  providers: [
    AccountsService,
    RefundsService,
    TransactionsService,
    HelpersService
  ]
})
export class BankingModule {}
