import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../infra/service/base.service';
import { CompanyEntity } from '../entities/person/company.entity';
import { CRUDRepository } from '../infra/repository/crud.repository';

@Injectable()
export class DeliveryPlaceService extends BaseService<CompanyEntity> {
  constructor(
    @Inject('KEY_REPOSITORY_DELIVERY_PLACE')
    private readonly deliveryPlaceRepository: CRUDRepository<CompanyEntity>,
  ) {
    super(deliveryPlaceRepository);
  }
}
