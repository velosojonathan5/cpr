import { Injectable } from '@nestjs/common';
import { CreateDeliveryPlaceDto } from './dto/create-delivery-place.dto';
import { UpdateDeliveryPlaceDto } from './dto/update-delivery-place.dto';

@Injectable()
export class DeliveryPlaceService {
  create(createDeliveryPlaceDto: CreateDeliveryPlaceDto) {
    return 'This action adds a new deliveryPlace';
  }

  findAll() {
    return `This action returns all deliveryPlace`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deliveryPlace`;
  }

  update(id: number, updateDeliveryPlaceDto: UpdateDeliveryPlaceDto) {
    return `This action updates a #${id} deliveryPlace`;
  }

  remove(id: number) {
    return `This action removes a #${id} deliveryPlace`;
  }
}
