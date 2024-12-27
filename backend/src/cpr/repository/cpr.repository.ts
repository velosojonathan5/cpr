import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from '../../infra/repository/typeORM/typeORM.repository';
import { CprModel } from './cpr.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CprRepository extends TypeORMRepository<CprModel> {
  constructor(
    @InjectRepository(CprModel)
    private cprRepository: Repository<CprModel>,
  ) {
    super(cprRepository);
  }

  insert(entity: CprModel): Promise<CprModel> {
    return this.cprRepository.save({
      ...entity,
      creditorDetails: entity.creditor,
      emitterDetails: entity.emitter,
      productDevelopmentSiteDetails: entity.productDevelopmentSite,
      deliveryPlaceDetails: entity.deliveryPlace,
    });
  }
}
