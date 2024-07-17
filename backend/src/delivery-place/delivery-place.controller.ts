import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DeliveryPlaceService } from './delivery-place.service';
import { CreateDeliveryPlaceDto } from './dto/create-delivery-place.dto';
import { UpdateDeliveryPlaceDto } from './dto/update-delivery-place.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Local de entrega')
@Controller('delivery-place')
export class DeliveryPlaceController {
  constructor(private readonly deliveryPlaceService: DeliveryPlaceService) {}

  @Post()
  create(@Body() createDeliveryPlaceDto: CreateDeliveryPlaceDto) {
    return this.deliveryPlaceService.create(createDeliveryPlaceDto);
  }

  @Get()
  findAll() {
    return this.deliveryPlaceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryPlaceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeliveryPlaceDto: UpdateDeliveryPlaceDto) {
    return this.deliveryPlaceService.update(+id, updateDeliveryPlaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryPlaceService.remove(+id);
  }
}
