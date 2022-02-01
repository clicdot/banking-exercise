import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from '../services/transactions.service';
import { HelpersService } from '../services/helpers/helpers.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionsEntity, RefundsEntity } from '../models/entities';

type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: jest.Mock<{}>;
};

const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn((entity) => entity),
  find: jest.fn((entity) => [...entity]),
  save: jest.fn((entity) => Promise.resolve(entity))
}));

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let transactionMock: MockType<Repository<TransactionsEntity>>;
  let refundsMock: MockType<Repository<RefundsEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
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

    controller = module.get<TransactionsController>(TransactionsController);
    transactionMock = module.get(getRepositoryToken(TransactionsEntity));
    refundsMock = module.get(getRepositoryToken(RefundsEntity));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(transactionMock).toBeDefined();
    expect(refundsMock).toBeDefined();
  });
});
