import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryPlaceService } from './delivery-place.service';

describe('DeliveryPlaceService', () => {
  let service: DeliveryPlaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryPlaceService],
    }).compile();

    service = module.get<DeliveryPlaceService>(DeliveryPlaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
