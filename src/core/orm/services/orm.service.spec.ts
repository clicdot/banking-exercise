import { Test, TestingModule } from '@nestjs/testing';
import { OrmService } from './orm.service';
import { ConfigService } from '@nestjs/config';

describe('OrmService', () => {
  let service: OrmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrmService, ConfigService]
    }).compile();

    service = module.get<OrmService>(OrmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
