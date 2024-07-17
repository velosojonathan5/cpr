import { Test, TestingModule } from '@nestjs/testing';
import { CreditorService } from './creditor.service';
import { InMemoryRepository } from '../infra/repository/in-memory/in-memory.repository';
import { CreditorEntity } from '../entities/person/creditor.entity';

describe('CreditorService', () => {
  let service: CreditorService;
  let repository: InMemoryRepository<CreditorEntity>;

  beforeEach(async () => {
    repository = new InMemoryRepository<CreditorEntity>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditorService,
        { provide: 'KEY_REPOSITORY_CREDITOR', useValue: repository },
      ],
    }).compile();

    service = module.get<CreditorService>(CreditorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
