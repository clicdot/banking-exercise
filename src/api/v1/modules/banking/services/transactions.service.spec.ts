import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { Repository } from 'typeorm';
import { TransactionsEntity, RefundsEntity } from '../models/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HelpersService } from './helpers/helpers.service';
import { BadRequestException } from '@nestjs/common';
import { TransactionType } from '../models/interfaces/transaction-details';

type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: jest.Mock<{}>;
};

const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn((entity) => entity),
  find: jest.fn((entity) => [...entity]),
  save: jest.fn((entity) => Promise.resolve(entity))
}));

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionMock: MockType<Repository<TransactionsEntity>>;
  let refundsMock: MockType<Repository<RefundsEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(TransactionsEntity),
          useFactory: repositoryMockFactory
        },
        {
          provide: getRepositoryToken(RefundsEntity),
          useFactory: repositoryMockFactory
        },
        HelpersService
      ]
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionMock = module.get(getRepositoryToken(TransactionsEntity));
    refundsMock = module.get(getRepositoryToken(RefundsEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(transactionMock).toBeDefined();
    expect(refundsMock).toBeDefined();
  });

  it('should create tranasction record', async () => {
    const dto = {
      user: {
        id: 'test-user',
        email: 'test-email@test.com'
      },
      accountNo: '2',
      action: 'create',
      amount: 100,
      transactionDetails: {
        type: TransactionType.CREDIT,
        to: '2',
        note: 'Account Creation: Account No: 2'
      }
    };

    try {
      await service.create(dto);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should create tranasction record throws error', async () => {
    const dto = null;

    try {
      await service.create(dto);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });
});
