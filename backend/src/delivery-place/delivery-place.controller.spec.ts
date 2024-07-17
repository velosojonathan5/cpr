import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryPlaceController } from './delivery-place.controller';
import { DeliveryPlaceService } from './delivery-place.service';

describe('DeliveryPlaceController', () => {
  let controller: DeliveryPlaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryPlaceController],
      providers: [DeliveryPlaceService],
    }).compile();

    controller = module.get<DeliveryPlaceController>(DeliveryPlaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
