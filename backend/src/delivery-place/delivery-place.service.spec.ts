import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryPlaceService } from './delivery-place.service';
import { CompanyEntity } from '../entities/person/company.entity';
import { InMemoryRepository } from '../infra/repository/in-memory/in-memory.repository';

describe('DeliveryPlaceService', () => {
  let service: DeliveryPlaceService;
  let repository: InMemoryRepository<CompanyEntity>;

  beforeEach(async () => {
    repository = new InMemoryRepository<CompanyEntity>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryPlaceService,
        { provide: 'KEY_REPOSITORY_DELIVERY_PLACE', useValue: repository },
      ],
    }).compile();

    service = module.get<DeliveryPlaceService>(DeliveryPlaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
