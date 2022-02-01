import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Repository } from 'typeorm';
import { AccountEntity, TransactionsEntity } from '../models/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HelpersService } from './helpers/helpers.service';
import { AccountDetails } from '../models/interfaces/account-details';
import { TransactionsService } from './transactions.service';

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
    } else {
      return entity;
    }
  }),
  find: jest.fn((entity) => [entity]),
  save: jest.fn((entity) => Promise.resolve(entity))
}));

const HelperProvider = {
  provide: HelpersService,
  useFactory: () => ({
    convertDollarToNumber: jest.fn(() => {
      return 100;
    }),
    deposit: jest.fn(() => {
      return 100;
    }),
    withdrawal: jest.fn(() => {
      return 100;
    }),
    getTransactionDates: jest.fn(() => {
      return [
        new Date('2022-01-01T00:00:00.000Z'),
        new Date('2022-02-01T00:00:00.000Z')
      ];
    }),
    dollarFormatter: jest.fn(() => {
      return '$100.00';
    })
  })
};

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

describe('AccountsService', () => {
  let service: AccountsService;
  let transactionService: TransactionsService;
  let accountsMock: MockType<Repository<AccountEntity>>;
  let transactionsMock: MockType<Repository<TransactionsEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: getRepositoryToken(AccountEntity),
          useFactory: repositoryMockFactory
        },
        {
          provide: getRepositoryToken(TransactionsEntity),
          useFactory: repositoryMockFactory
        },
        HelpersService,
        HelperProvider,
        TransactionProvider
      ]
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    transactionService = module.get<TransactionsService>(TransactionsService);
    accountsMock = module.get(getRepositoryToken(AccountEntity));
    transactionsMock = module.get(getRepositoryToken(TransactionsEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(transactionService).toBeDefined();
    expect(accountsMock).toBeDefined();
    expect(transactionsMock).toBeDefined();
  });

  it('should create account', async () => {
    const dto = {
      user: {
        id: '1',
        email: 'test@test.com'
      },
      type: 'Wallet',
      balance: 100,
      accountDetails: {
        fullName: 'Jane Doe',
        streetAddress: '123 street',
        address2: '',
        city: 'dallas',
        state: 'tx',
        postCode: '75201'
      }
    };
    const accounts: Partial<AccountEntity> = await service.create(dto);

    expect(accounts.user).toEqual({
      id: '1',
      email: 'test@test.com'
    });
    expect(accounts.balance).toEqual(100);
    expect(accounts.accountDetails.fullName).toEqual('Jane Doe');
  });

  it('should create account throw error', async () => {
    const dto = null;
    try {
      await service.create(dto);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should get accounts', async () => {
    const accounts = await service.accounts();

    expect(accountsMock.find).toHaveBeenCalled();
    jest.spyOn(accountsMock, 'find').mockImplementation();

    expect(accounts).toEqual([
      { where: { isActive: true, isArchived: false } }
    ]);
  });

  // it('should get accounts throws error', async () => {
  //   const accounts = await service.accounts();

  //   expect(accountsMock.find).toHaveBeenCalled();
  //   jest
  //     .spyOn(accountsMock, 'find')
  //     .mockRejectedValue('There was an error');

  //   expect(accounts).toEqual([
  //     { where: { isActive: true, isArchived: false } }
  //   ]);
  // });

  it('should get accounts by id', async () => {
    const accounts = await service.accountsById(
      'ac937a17-1e1f-4541-938b-e610572cab42'
    );

    expect(accountsMock.find).toHaveBeenCalled();
    jest.spyOn(accountsMock, 'find').mockImplementation();

    expect(accounts).toEqual([
      {
        where: {
          accountNo: 'ac937a17-1e1f-4541-938b-e610572cab42',
          isActive: true,
          isArchived: false
        }
      }
    ]);
  });

  it('should get account by id throw error', async () => {
    try {
      await service.accountsById(null);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should delete account by id', async () => {
    try {
      await service.delete('ac937a17-1e1f-4541-938b-e610572cab42');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should delete account by id throw error', async () => {
    try {
      await service.delete(null);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should delete account by id throw error', async () => {
    try {
      await service.delete('1');
      const t = jest.spyOn(accountsMock, 'findOne');

      t.mockImplementation(() => null);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should modify account by id', async () => {
    try {
      await service.modify('ac937a17-1e1f-4541-938b-e610572cab42', {});
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should modify account by id throw error', async () => {
    try {
      await service.modify(null, {});
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should modify account by id throw error', async () => {
    try {
      await service.modify('1', {});
      const t = jest.spyOn(accountsMock, 'findOne');

      t.mockImplementation(() => null);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should modify account by id throw error', async () => {
    try {
      await service.modify('2', {});
      const t = jest.spyOn(accountsMock, 'findOne').mockImplementation(() => {
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
      });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should deposit money to account', async () => {
    await service.deposit('2', 100);
  });

  it('should deposit money to account no amount', async () => {
    try {
      await service.deposit('2', null);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should deposit money to account throw error', async () => {
    try {
      await service.deposit('1', 100);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should withdrawal money to account', async () => {
    await service.withdrawal('2', 100);
  });

  it('should withdrawal money to account no amount', async () => {
    try {
      await service.withdrawal('2', null);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should withdrawal money to account throw error', async () => {
    try {
      await service.withdrawal('1', 100);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should withdrawal money to account too much throw error', async () => {
    try {
      await service.withdrawal('2', 500);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should transfer money to account', async () => {
    await service.transfer('2', '2', 100);
  });

  it('should transfer money to account no amount', async () => {
    try {
      await service.transfer('2', '2', null);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should transfer money to account large amount', async () => {
    try {
      await service.transfer('2', '2', 1000);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should transfer money to account throw error', async () => {
    try {
      await service.transfer('1', '2', 100);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should transfer money to account throw error', async () => {
    try {
      await service.transfer('2', '1', 100);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should create a transaction record w/ no dates', async () => {
    try {
      await service.transactions('2');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should create a transaction record w/ dates', async () => {
    try {
      await service.transactions('2', [
        new Date('2022-01-01'),
        new Date('2022-01-31')
      ]);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('should create a transaction record w/ no dates', async () => {
    try {
      await service.transactions('1');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });
});
