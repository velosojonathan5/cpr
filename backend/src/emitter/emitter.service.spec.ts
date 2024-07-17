import { Test, TestingModule } from '@nestjs/testing';
import { EmitterService } from './emitter.service';
import { InMemoryRepository } from '../infra/repository/in-memory/in-memory.repository';
import { EmitterEntity } from '../entities/person/emitter.entity';

describe('EmitterService', () => {
  let service: EmitterService;
  let repository: InMemoryRepository<EmitterEntity>;

  beforeEach(async () => {
    repository = new InMemoryRepository<EmitterEntity>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmitterService,
        { provide: 'KEY_REPOSITORY_EMITTER', useValue: repository },
      ],
    }).compile();

    service = module.get<EmitterService>(EmitterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
