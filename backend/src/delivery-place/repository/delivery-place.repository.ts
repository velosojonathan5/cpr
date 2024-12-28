import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from '../../infra/repository/typeORM/typeORM.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CompanyEntity,
  LegalRepresentative,
} from 'src/entities/person/company.entity';
import { AddressEntity } from 'src/entities/person/address.entity';
import { DeliveryPlaceModel } from './delivery-place.model';

@Injectable()
export class DeliveryPlaceRepository extends TypeORMRepository<CompanyEntity> {
  constructor(
    @InjectRepository(DeliveryPlaceModel)
    private deliveryPlaceRepository: Repository<DeliveryPlaceModel>,
  ) {
    super(deliveryPlaceRepository);
  }

  async getById(id: string): Promise<CompanyEntity> {
    const deliveryPlace = await this.deliveryPlaceRepository.findOne({
      where: { id },
      relations: { address: true },
    });

    if (deliveryPlace) {
      return CompanyEntity.restore({
        ...deliveryPlace,
        legalRepresentative: new LegalRepresentative(
          deliveryPlace.legalRepresentativeName,
          deliveryPlace.legalRepresentativeCpf,
        ),
        address: AddressEntity.restore(deliveryPlace.address),
      });
    }
  }
}
