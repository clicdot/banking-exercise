import { Test, TestingModule } from '@nestjs/testing';
import { InterceptorHelperService } from './interceptor-helper.service';

describe('InterceptorHelperService', () => {
  let service: InterceptorHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InterceptorHelperService],
    }).compile();

    service = module.get<InterceptorHelperService>(InterceptorHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
