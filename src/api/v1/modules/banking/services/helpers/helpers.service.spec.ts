import { Test, TestingModule } from '@nestjs/testing';
import { HelpersService } from './helpers.service';

describe('HelpersService', () => {
  let service: HelpersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelpersService]
    }).compile();

    service = module.get<HelpersService>(HelpersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should convert $ to number', () => {
    const dollar = service.convertDollarToNumber('$100.00');
    expect(dollar).toEqual(100);
  });

  it('should deposit $ to account', () => {
    const dollar = service.deposit(100, 100);
    expect(dollar).toEqual(200);
  });

  it('should withdrawal $ to account', () => {
    const dollar = service.withdrawal(50, 100);
    expect(dollar).toEqual(50);
  });

  it('should get dates if none provided', () => {
    const dates = service.getTransactionDates();
    expect(dates.length).toEqual(2);
  });

  it('should get dates if provided', () => {
    const dates = service.getTransactionDates([
      new Date('2022-01-01'),
      new Date('2022-01-31')
    ]);
    expect(dates.length).toEqual(2);
  });

  it('should get dates if provided in wrong order', () => {
    const dates = service.getTransactionDates([
      new Date('2022-01-31'),
      new Date('2022-01-01')
    ]);
    expect(dates.length).toEqual(2);
  });

  it('should convert numbers to dollars', () => {
    const dollar = service.dollarFormatter(2000);
    expect(dollar).toEqual('$2,000.00');
  });

  it('should copy json', () => {
    const json = {
      id: 1,
      accountNo: '1',
      amount: 100,
      transactionDetails: {
        note: ''
      }
    };
    const newJson = service.copyJson(json);
    expect(newJson).toEqual({
      id: 1,
      accountNo: '1',
      amount: 100,
      status: 'PENDING',
      transactionDetails: {
        note: 'Refund Creation: Account No: 1 for amount 100'
      },
      transactionId: 1
    });
  });
});
