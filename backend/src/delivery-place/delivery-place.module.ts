import { Module } from '@nestjs/common';
import { DeliveryPlaceService } from './delivery-place.service';
import { DeliveryPlaceController } from './delivery-place.controller';

@Module({
  controllers: [DeliveryPlaceController],
  providers: [DeliveryPlaceService],
})
export class DeliveryPlaceModule {}
