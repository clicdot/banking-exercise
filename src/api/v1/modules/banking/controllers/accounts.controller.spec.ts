import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from '../services/accounts.service';
import { AccountEntity, TransactionsEntity } from '../models/entities';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HelpersService } from '../services/helpers/helpers.service';

type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: jest.Mock<{}>;
};

const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn((entity) => entity),
  find: jest.fn((entity) => [...entity]),
  save: jest.fn((entity) => Promise.resolve(entity))
}));

const AccountsServiceProvider = {
  provide: AccountsService,
  useFactory: () => ({
    accounts: jest.fn(() => {
      return {
        id: 1,
        user: {
          id: '1',
          email: 'test@test.com'
        },
        accountNo: 'ac937a17-1e1f-4541-938b-e610572cab42',
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
    }),
    accountsById: jest.fn(() => {
      return {
        id: 1,
        user: {
          id: '1',
          email: 'test@test.com'
        },
        accountNo: 'ac937a17-1e1f-4541-938b-e610572cab42',
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
    }),
    create: jest.fn(() => {
      return {
        activity: {
          detailTime: '2021-12-14T15:09:11.301Z',
          details: 'details',
          head: 'head'
        },
        branch: { id: 1, label: 'branch' },
        category: 'some',
        location: { id: 1, label: 'branch' },
        room: { id: 1, label: 'branch' },
        user: { email: 'test@test.com', id: 1 },
        validation: 'some'
      };
    }),
    modify: jest.fn(() => {
      return {
        activity: {
          detailTime: '2021-12-14T15:09:11.301Z',
          details: 'details',
          head: 'head'
        },
        branch: { id: 1, label: 'branch' },
        category: 'some',
        location: { id: 1, label: 'branch' },
        room: { id: 1, label: 'branch' },
        user: { email: 'test@test.com', id: 1 },
        validation: 'some'
      };
    }),
    delete: jest.fn(() => {
      return {
        activity: {
          detailTime: '2021-12-14T15:09:11.301Z',
          details: 'details',
          head: 'head'
        },
        branch: { id: 1, label: 'branch' },
        category: 'some',
        location: { id: 1, label: 'branch' },
        room: { id: 1, label: 'branch' },
        user: { email: 'test@test.com', id: 1 },
        validation: 'some'
      };
    }),
    deposit: jest.fn(() => {
      return {
        activity: {
          detailTime: '2021-12-14T15:09:11.301Z',
          details: 'details',
          head: 'head'
        },
        branch: { id: 1, label: 'branch' },
        category: 'some',
        location: { id: 1, label: 'branch' },
        room: { id: 1, label: 'branch' },
        user: { email: 'test@test.com', id: 1 },
        validation: 'some'
      };
    }),
    withdrawal: jest.fn(() => {
      return {
        activity: {
          detailTime: '2021-12-14T15:09:11.301Z',
          details: 'details',
          head: 'head'
        },
        branch: { id: 1, label: 'branch' },
        category: 'some',
        location: { id: 1, label: 'branch' },
        room: { id: 1, label: 'branch' },
        user: { email: 'test@test.com', id: 1 },
        validation: 'some'
      };
    }),
    transfer: jest.fn(() => {
      return {
        activity: {
          detailTime: '2021-12-14T15:09:11.301Z',
          details: 'details',
          head: 'head'
        },
        branch: { id: 1, label: 'branch' },
        category: 'some',
        location: { id: 1, label: 'branch' },
        room: { id: 1, label: 'branch' },
        user: { email: 'test@test.com', id: 1 },
        validation: 'some'
      };
    }),
    transactions: jest.fn(() => {
      return {
        activity: {
          detailTime: '2021-12-14T15:09:11.301Z',
          details: 'details',
          head: 'head'
        },
        branch: { id: 1, label: 'branch' },
        category: 'some',
        location: { id: 1, label: 'branch' },
        room: { id: 1, label: 'branch' },
        user: { email: 'test@test.com', id: 1 },
        validation: 'some'
      };
    })
  })
};

describe('AccountsController', () => {
  let controller: AccountsController;
  let service: AccountsService;
  let accountsMock: MockType<Repository<AccountEntity>>;
  let transactionsMock: MockType<Repository<TransactionsEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        AccountsService,
        AccountsServiceProvider,
        {
          provide: getRepositoryToken(AccountEntity),
          useFactory: repositoryMockFactory
        },
        {
          provide: getRepositoryToken(TransactionsEntity),
          useFactory: repositoryMockFactory
        },
        HelpersService
      ]
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    service = module.get<AccountsService>(AccountsService);
    accountsMock = module.get(getRepositoryToken(AccountEntity));
    transactionsMock = module.get(getRepositoryToken(TransactionsEntity));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(accountsMock).toBeDefined();
    expect(transactionsMock).toBeDefined();
  });

  it('should get accounts', async () => {
    controller.accounts();
    expect(service.accounts).toHaveBeenCalled();
  });

  it('should get accountsById', async () => {
    controller.accountsById('ac937a17-1e1f-4541-938b-e610572cab42');
    expect(service.accountsById).toHaveBeenCalled();
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
    controller.create(dto);
    expect(service.create).toHaveBeenCalled();
  });

  it('should modify account', async () => {
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
    controller.modify('ac937a17-1e1f-4541-938b-e610572cab42', dto);
    expect(service.modify).toHaveBeenCalled();
  });

  it('should delete accounts', async () => {
    controller.delete('ac937a17-1e1f-4541-938b-e610572cab42');
    expect(service.delete).toHaveBeenCalled();
  });

  it('should deposit accounts', async () => {
    controller.deposit('ac937a17-1e1f-4541-938b-e610572cab42', 100);
    expect(service.deposit).toHaveBeenCalled();
  });

  it('should withdrawal accounts', async () => {
    controller.withdrawal('ac937a17-1e1f-4541-938b-e610572cab42', 100);
    expect(service.withdrawal).toHaveBeenCalled();
  });

  it('should transfer accounts', async () => {
    controller.transfer(
      'ac937a17-1e1f-4541-938b-e610572cab42',
      'e0a19147-bf2a-4bcc-99b1-5378d4076ed7',
      100
    );
    expect(service.transfer).toHaveBeenCalled();
  });

  it('should get transactions for accounts', async () => {
    controller.transactions('ac937a17-1e1f-4541-938b-e610572cab42', [
      new Date('2022-01-01T00:00:00.000Z'),
      new Date('2022-02-01T00:00:00.000Z')
    ]);
    expect(service.transactions).toHaveBeenCalled();
  });
});
