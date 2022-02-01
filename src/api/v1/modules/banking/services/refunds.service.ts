import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AccountEntity,
  TransactionsEntity,
  RefundsEntity
} from '../models/entities';
import { RefundsStatus } from '../models/interfaces';
import { TransactionsService } from './transactions.service';
import { RefundsDto, RefundsResponseDto } from '../models/dtos/refunds.dto';
import { TransactionActions } from '../models/interfaces/actions';
import { TransactionType } from '../models/interfaces/transaction-details';
import { HelpersService } from './helpers/helpers.service';

@Injectable()
export class RefundsService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountsModel: Repository<AccountEntity>,
    @InjectRepository(TransactionsEntity)
    private readonly transactionsModel: Repository<TransactionsEntity>,
    @InjectRepository(RefundsEntity)
    private readonly refundsModel: Repository<RefundsEntity>,
    private readonly transactionSvc: TransactionsService,
    private readonly __helper: HelpersService
  ) {}

  async refundProcess(accountId, refundsId): Promise<RefundsResponseDto> {
    try {
      const account = await this.accountsModel.findOne({
        where: {
          accountNo: accountId
        }
      });

      if (!account) {
        throw new BadRequestException(
          'Refund Error: AccountID could not be found'
        );
      }

      const refund = await this.refundsModel.findOne({
        where: {
          transactionId: refundsId,
          accountNo: accountId
        }
      });

      if (refund) {
        throw new BadRequestException('Refund Error: Refund already requested');
      }

      const transaction = await this.transactionsModel.findOne({
        where: {
          id: refundsId,
          accountNo: accountId
        }
      });

      if (!transaction) {
        throw new BadRequestException(
          'Refund Error: Transaction could not be found'
        );
      }

      const trans = this.__helper.copyJson(transaction);

      return this.create(trans, account.user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async refundApproval(
    accountId: string,
    refundsId: number,
    approve: boolean
  ): Promise<RefundsResponseDto> {
    try {
      const account = await this.accountsModel.findOne({
        where: {
          accountNo: accountId
        }
      });

      if (!account) {
        throw new BadRequestException(
          'Refund Error: AccountID could not be found'
        );
      }

      const refund = await this.refundsModel.findOne({
        where: {
          transactionId: refundsId,
          accountNo: accountId
        }
      });

      if (!refund) {
        throw new BadRequestException(
          'Refund Error: Refund could not be found'
        );
      }

      this.transactionSvc.create({
        user: account.user,
        accountNo: accountId,
        action: TransactionActions.REFUND,
        amount: refund.amount,
        transactionDetails: {
          type: TransactionType.CREDIT,
          to: accountId,
          transactionId: refund.transactionId,
          note: `Refund Approval: Account No: ${accountId} for amount ${
            refund.amount
          } : ${approve ? 'APPROVED' : 'DENIED'}`
        }
      });

      await this.refundsModel.update(
        {
          transactionId: refundsId,
          accountNo: accountId
        },
        {
          status: approve ? RefundsStatus.APPROVED : RefundsStatus.DENIED
        }
      );

      return this.refundsModel.findOne({
        transactionId: refundsId,
        accountNo: accountId
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  refundsRequests(): Promise<RefundsResponseDto[]> {
    try {
      return this.refundsModel
        .find({
          where: {
            status: 'PENDING'
          }
        })
        .then((e) => e.map((i) => RefundsDto.fromEntity(i)));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  create(dto, user) {
    try {
      return this.refundsModel
        .save(RefundsDto.toEntity(dto, user))
        .then((e) => {
          this.transactionSvc.create({
            user: dto.user,
            accountNo: e.accountNo,
            action: TransactionActions.REFUND,
            amount: e.amount,
            transactionDetails: {
              type: TransactionType.CREDIT,
              to: e.accountNo,
              transactionId: e.transactionId,
              note: `Refund Creation: Account No: ${e.accountNo} for amount ${e.amount}`
            }
          });
          return RefundsDto.fromEntity(e);
        });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
