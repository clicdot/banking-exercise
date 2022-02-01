import { Test, TestingModule } from '@nestjs/testing';
import { RefundsService } from './refunds.service';
import { TransactionsService } from './transactions.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { HelpersService } from './helpers/helpers.service';
import {
  AccountEntity,
  TransactionsEntity,
  RefundsEntity
} from './../models/entities';

type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: jest.Mock<{}>;
};

const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn((entity) => {
    if (entity.where.accountNo === '1') {
      return null;
    } else if (entity.where.accountNo === '2') {
      return {
        id: 1,
        user: {
          id: '1',
          email: 'test@test.com'
        },
        accountNo: '2',
        type: 'Wallet',
        balance: '$100.00',
        accountDetails: {
          fullName: 'Jane Doe',
          streetAddress: '123 street',
          address2: '',
          city: 'dallas',
          state: 'tx',
          postCode: '75201'
        }
      };
    } else if (entity.where.transactionId) {
      if (entity.where.transactionId === 0) {
        return null;
      } else if (entity.where.transactionId === 1) {
        return {
          id: 9,
          accountNo: '85497800-5021-4bd8-92b3-10f9dc1a80e7',
          transactionId: '5',
          status: 'PENDING',
          action: 'withdrawal',
          amount: '$50.00',
          transactionDetails: {
            to: '85497800-5021-4bd8-92b3-10f9dc1a80e7',
            from: '13486988-6719-4043-a905-9ea60fa03845',
            note: 'Refund Creation: Account No: 85497800-5021-4bd8-92b3-10f9dc1a80e7 for amount $50.00',
            type: 'credit'
          },
          createdAt: '2022-01-22T01:43:00.547Z',
          updatedAt: '2022-01-22T01:43:00.547Z'
        };
      }
    } else {
      return entity;
    }
  }),
  find: jest.fn((entity) => Promise.resolve([{ id: 1 }])),
  save: jest.fn((entity) => Promise.resolve(entity))
}));

const refundRepositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => {
      if (entity.where.transactionId === 0) {
        return null;
      } else if (entity.where.transactionId === 1) {
        return {
          id: 9,
          accountNo: '85497800-5021-4bd8-92b3-10f9dc1a80e7',
          transactionId: '5',
          status: 'PENDING',
          action: 'withdrawal',
          amount: '$50.00',
          transactionDetails: {
            to: '85497800-5021-4bd8-92b3-10f9dc1a80e7',
            from: '13486988-6719-4043-a905-9ea60fa03845',
            note: 'Refund Creation: Account No: 85497800-5021-4bd8-92b3-10f9dc1a80e7 for amount $50.00',
            type: 'credit'
          },
          createdAt: '2022-01-22T01:43:00.547Z',
          updatedAt: '2022-01-22T01:43:00.547Z'
        };
      } else {
        return entity;
      }
    }),
    find: jest.fn((entity) => Promise.resolve([{ id: 1 }])),
    save: jest.fn((entity) => Promise.resolve(entity))
  })
);

const transRepositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => {
      if (entity.where.id === 0) {
        return null;
      } else if (entity.where.id === 1) {
        return {
          id: 9,
          accountNo: '85497800-5021-4bd8-92b3-10f9dc1a80e7',
          transactionId: '5',
          status: 'PENDING',
          action: 'withdrawal',
          amount: '$50.00',
          transactionDetails: {
            to: '85497800-5021-4bd8-92b3-10f9dc1a80e7',
            from: '13486988-6719-4043-a905-9ea60fa03845',
            note: 'Refund Creation: Account No: 85497800-5021-4bd8-92b3-10f9dc1a80e7 for amount $50.00',
            type: 'credit'
          },
          createdAt: '2022-01-22T01:43:00.547Z',
          updatedAt: '2022-01-22T01:43:00.547Z'
        };
      } else {
        return entity;
      }
    }),
    find: jest.fn((entity) => Promise.resolve([{ id: 1 }])),
    save: jest.fn((entity) => Promise.resolve(entity))
  })
);

const TransactionProvider = {
  provide: TransactionsService,
  useFactory: () => ({
    create: jest.fn((e) => {
      return {
        id: 1,
        accountNo: e.accountNo,
        action: e.action,
        amount: e.amount,
        AccountDetails: e.AccountDetails
      };
    })
  })
};

const HelperProvider = {
  provide: HelpersService,
  useFactory: () => ({
    copyJson: jest.fn((e) => {
      return e;
    })
  })
};

describe('RefundsService', () => {
  let service: RefundsService;
  let transactionService: TransactionsService;
  let __helper: HelpersService;
  let accountsMock: MockType<Repository<AccountEntity>>;
  let transactionsMock: MockType<Repository<TransactionsEntity>>;
  let refundsMock: MockType<Repository<RefundsEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefundsService,
        TransactionsService,
        TransactionProvider,
        HelpersService,
        HelperProvider,
        {
          provide: getRepositoryToken(AccountEntity),
          useFactory: repositoryMockFactory
        },
        {
          provide: getRepositoryToken(TransactionsEntity),
          useFactory: transRepositoryMockFactory
        },
        {
          provide: getRepositoryToken(RefundsEntity),
          useFactory: refundRepositoryMockFactory
        }
      ]
    }).compile();

    service = module.get<RefundsService>(RefundsService);
    transactionService = module.get<TransactionsService>(TransactionsService);
    accountsMock = module.get(getRepositoryToken(AccountEntity));
    transactionsMock = module.get(getRepositoryToken(TransactionsEntity));
    refundsMock = module.get(getRepositoryToken(RefundsEntity));
    __helper = module.get<HelpersService>(HelpersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(transactionService).toBeDefined();
    expect(accountsMock).toBeDefined();
    expect(transactionsMock).toBeDefined();
    expect(refundsMock).toBeDefined();
    expect(__helper).toBeDefined();
  });

  it('should get all refund requests', async () => {
    const rq = service.refundsRequests();
    expect(refundsMock.find).toHaveBeenCalled();
    jest.spyOn(refundsMock, 'find').mockImplementation();
  });

  // it('should make refund requests', async () => {
  //   try {
  //     const rq = service.refundProcess('3', 0);
  //     // expect(refundsMock.find).toHaveBeenCalled();
  //     // jest.spyOn(refundsMock, 'find').mockImplementation();
  //   } catch (error) {
  //     expect(error).toBeInstanceOf(BadRequestException);
  //   }
  // });

  it('should make refund requests w/ error', async () => {
    try {
      const rq = await service.refundProcess('1', 1);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should make refund requests w/ error', async () => {
    try {
      const rq = await service.refundProcess('2', 1);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should make refund requests w/ error', async () => {
    try {
      const rq = await service.refundProcess('2', 0);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should approve refund requests', async () => {
    try {
      const rq = await service.refundApproval('1', 1, true);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should approve refund requests', async () => {
    try {
      const rq = await service.refundApproval('1', 1, false);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should approve refund requests', async () => {
    try {
      const rq = await service.refundApproval('2', 0, true);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should approve refund requests', async () => {
    try {
      const rq = await service.refundApproval('2', 0, false);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should approve refund requests', async () => {
    try {
      const rq = await service.refundApproval('2', 1, true);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should approve refund requests', async () => {
    try {
      const rq = await service.refundApproval('2', 1, false);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should create refund requests record', async () => {
    try {
      const dto = {
        id: 9,
        accountNo: '85497800-5021-4bd8-92b3-10f9dc1a80e7',
        action: 'refund',
        amount: '$50.00',
        transactionDetails: {
          to: '85497800-5021-4bd8-92b3-10f9dc1a80e7',
          note: 'Refund Creation: Account No: 85497800-5021-4bd8-92b3-10f9dc1a80e7 for amount $50.00',
          type: 'credit',
          transactionId: 5
        },
        createdAt: '2022-01-22T01:38:09.755Z',
        updatedAt: '2022-01-22T01:38:09.755Z'
      };
      const rq = await service.create(dto, {
        id: 1,
        email: 'test@email.com'
      });
      const copy = jest.spyOn(__helper, 'copyJson');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should create refund requests record throws error', async () => {
    try {
      const dto = null;
      const rq = await service.create(dto, {
        id: 1,
        email: 'test@email.com'
      });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });
});
