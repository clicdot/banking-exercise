import { Test, TestingModule } from '@nestjs/testing';
import { RefundsController } from './refunds.controller';
import { RefundsService } from '../services/refunds.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountEntity, TransactionsEntity } from './../models/entities';
import { Repository } from 'typeorm';

type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: jest.Mock<{}>;
};

const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn((entity) => entity),
  find: jest.fn((entity) => [...entity]),
  save: jest.fn((entity) => Promise.resolve(entity))
}));

const RefundsServiceProvider = {
  provide: RefundsService,
  useFactory: () => ({
    refundProcess: jest.fn(() => {
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
    refundApproval: jest.fn(() => {
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
    refundsRequests: jest.fn(() => {
      return [
        {
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
        },
        {
          id: 2,
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
        }
      ];
    })
  })
};

describe('RefundsController', () => {
  let controller: RefundsController;
  let service: RefundsService;
  let accountsMock: MockType<Repository<AccountEntity>>;
  let transactionsMock: MockType<Repository<TransactionsEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefundsController],
      providers: [
        RefundsService,
        RefundsServiceProvider,
        {
          provide: getRepositoryToken(AccountEntity),
          useFactory: repositoryMockFactory
        },
        {
          provide: getRepositoryToken(TransactionsEntity),
          useFactory: repositoryMockFactory
        }
      ]
    }).compile();

    controller = module.get<RefundsController>(RefundsController);
    service = module.get<RefundsService>(RefundsService);
    accountsMock = module.get(getRepositoryToken(AccountEntity));
    transactionsMock = module.get(getRepositoryToken(TransactionsEntity));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(accountsMock).toBeDefined();
    expect(transactionsMock).toBeDefined();
  });

  it('should refunds request', async () => {
    controller.refundProcess('ac937a17-1e1f-4541-938b-e610572cab42', 100);
    jest.spyOn(service, 'refundProcess').mockImplementation();
  });

  it('should refunds approval', async () => {
    controller.refundApproval('ac937a17-1e1f-4541-938b-e610572cab42', 100);
    jest.spyOn(service, 'refundApproval').mockImplementation();
  });

  it('should get all refunds request', async () => {
    controller.refundsRequests();
    jest.spyOn(service, 'refundsRequests').mockImplementation();
  });
});
