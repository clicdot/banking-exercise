import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, MoreThan, Repository } from 'typeorm';
import { AccountEntity, TransactionsEntity } from './../models/entities';
import { HelpersService } from './helpers/helpers.service';
import {
  AccountsDto,
  AccountsResponseDto,
  TransactionsDto,
  TransactionsResponseDto
} from '../models/dtos';
import { TransactionsService } from './transactions.service';
import { TransactionActions } from '../models/interfaces/actions';
import { TransactionType } from '../models/interfaces/transaction-details';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountsModel: Repository<AccountEntity>,
    @InjectRepository(TransactionsEntity)
    private readonly transactionsModel: Repository<TransactionsEntity>,
    private readonly __helpers: HelpersService,
    private readonly transactionSvc: TransactionsService
  ) {}

  async accounts(): Promise<AccountsResponseDto[]> {
    try {
      return await this.accountsModel.find({
        where: {
          isActive: true,
          isArchived: false
        }
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async accountsById(accountId: string): Promise<AccountsResponseDto[]> {
    try {
      if (!accountId) {
        throw new BadRequestException('Account Error: Invalid AccountID');
      }
      return await this.accountsModel.find({
        where: {
          accountNo: accountId,
          isActive: true,
          isArchived: false
        }
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  create(dto): Promise<AccountsResponseDto> {
    try {
      return this.accountsModel
        .save(AccountsDto.toEntity(dto, dto.user))
        .then((e) => {
          this.transactionSvc.create({
            user: dto.user,
            accountNo: e.accountNo,
            action: TransactionActions.CREATE,
            amount: e.balance,
            transactionDetails: {
              type: TransactionType.CREDIT,
              to: e.accountNo,
              note: `Account Creation: Account No: ${e.accountNo}`
            }
          });
          return AccountsDto.fromEntity(e);
        });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async modify(accountId: string, dto): Promise<AccountsResponseDto> {
    try {
      const account = await this.accountsModel.findOne({
        where: {
          accountNo: accountId
        }
      });

      if (!account) {
        throw new BadRequestException(
          'Delete Error: AccountID could not be found'
        );
      }

      await this.accountsModel.update(
        {
          accountNo: accountId
        },
        dto
      );

      const newAccount = await this.accountsModel.findOne({
        where: {
          accountNo: accountId
        }
      });

      return AccountsDto.fromEntity(newAccount);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async delete(accountId: string): Promise<AccountsResponseDto> {
    try {
      if (!accountId) {
        throw new BadRequestException('Account Error: Invalid AccountID');
      }
      const account = await this.accountsModel.findOne({
        where: {
          accountNo: accountId
        }
      });

      if (!account) {
        throw new BadRequestException(
          'Delete Error: AccountID could not be found'
        );
      }

      account.isActive = false;

      const results = await this.accountsModel.save(account);

      return AccountsDto.fromEntity(results);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deposit(accountId, amount): Promise<AccountsResponseDto> {
    try {
      if (!amount) {
        throw new BadRequestException('Deposit Error: No amount specified');
      }

      const account = await this.accountsModel.findOne({
        where: {
          accountNo: accountId
        }
      });

      if (!account) {
        throw new BadRequestException(
          'Deposit Error: AccountID could not be found'
        );
      }

      const newBalance = this.__helpers.deposit(
        amount,
        this.__helpers.convertDollarToNumber(account.balance)
      );

      account.balance = newBalance;

      const results = await this.accountsModel.save(account);

      this.transactionSvc.create({
        user: results.user,
        accountNo: results.accountNo,
        action: TransactionActions.DEPOSIT,
        amount: amount,
        transactionDetails: {
          type: TransactionType.CREDIT,
          to: results.accountNo,
          note: `Account Deposit: ${this.__helpers.dollarFormatter(amount)}`
        }
      });

      return AccountsDto.fromEntity(results);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async withdrawal(accountId, amount): Promise<AccountsResponseDto> {
    try {
      if (!amount || isNaN(amount)) {
        throw new BadRequestException('Withdrawal Error: No amount specified');
      }

      const account = await this.accountsModel.findOne({
        where: {
          accountNo: accountId
        }
      });

      if (!account) {
        throw new BadRequestException(
          'Withdrawal Error: AccountID could not be found'
        );
      }

      const newBalance = this.__helpers.withdrawal(
        amount,
        this.__helpers.convertDollarToNumber(account.balance)
      );

      if (newBalance < 0) {
        throw new BadRequestException(
          'Withdrawal Error: Amount withdrawn exceeds balance'
        );
      }

      account.balance = newBalance;

      const results = await this.accountsModel.save(account);

      this.transactionSvc.create({
        user: results.user,
        accountNo: results.accountNo,
        action: TransactionActions.WITHDRAWAL,
        amount: amount,
        transactionDetails: {
          type: TransactionType.DEBIT,
          to: results.accountNo,
          note: `Account Withdrawal: ${this.__helpers.dollarFormatter(amount)}`
        }
      });

      return AccountsDto.fromEntity(results);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async transfer(
    fromAccountId,
    toAccountId,
    amount
  ): Promise<AccountsResponseDto> {
    try {
      if (!amount || isNaN(amount)) {
        throw new BadRequestException('Transfer Error: No amount specified');
      }

      const fromAccount = await this.accountsModel.findOne({
        where: {
          accountNo: fromAccountId
        }
      });

      if (!fromAccount) {
        throw new BadRequestException(
          'Transfer Error: From AccountID could not be found'
        );
      }

      const toAccount = await this.accountsModel.findOne({
        where: {
          accountNo: toAccountId
        }
      });

      if (!toAccount) {
        throw new BadRequestException(
          'Transfer Error: To AccountID could not be found'
        );
      }

      const newBalance = this.__helpers.withdrawal(
        amount,
        this.__helpers.convertDollarToNumber(fromAccount.balance)
      );

      if (newBalance < 0) {
        throw new BadRequestException(
          'Transfer Error: Amount to transfer exceeds balance'
        );
      }

      const newToBalance = this.__helpers.deposit(
        amount,
        this.__helpers.convertDollarToNumber(toAccount.balance)
      );

      fromAccount.balance = newBalance;
      toAccount.balance = newToBalance;

      const results = await this.accountsModel.save(fromAccount);
      await this.accountsModel.save(toAccount);

      // From
      this.transactionSvc.create({
        user: fromAccount.user,
        accountNo: fromAccount.accountNo,
        action: TransactionActions.TRANSFER,
        amount: amount,
        transactionDetails: {
          type: TransactionType.DEBIT,
          from: fromAccount.accountNo,
          to: toAccount.accountNo,
          note: `Account Transfer: ${this.__helpers.dollarFormatter(
            amount
          )} to ${toAccount.accountNo}`
        }
      });
      // To
      this.transactionSvc.create({
        user: toAccount.user,
        accountNo: toAccount.accountNo,
        action: TransactionActions.TRANSFER,
        amount: amount,
        transactionDetails: {
          type: TransactionType.CREDIT,
          from: fromAccount.accountNo,
          to: toAccount.accountNo,
          note: `Account Transfer: ${this.__helpers.dollarFormatter(
            amount
          )} from ${fromAccount.accountNo}`
        }
      });

      return AccountsDto.fromEntity(results);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async transactions(accountId, dates?): Promise<TransactionsResponseDto[]> {
    try {
      const dateRange = this.__helpers.getTransactionDates(dates);

      const account = await this.accountsModel.findOne({
        where: {
          accountNo: accountId
        }
      });

      if (!account) {
        throw new BadRequestException(
          'Transactions Error: AccountID could not be found'
        );
      }

      const transactions = await this.transactionsModel.find({
        where: {
          accountNo: accountId,
          isActive: true,
          isArchived: false,
          createdAt: Between(dateRange[0], dateRange[1])
        },
        order: {
          ['createdAt']: 'ASC'
        }
      });

      return transactions.map((i) => TransactionsDto.fromEntity(i));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
