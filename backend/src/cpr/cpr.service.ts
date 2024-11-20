import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../infra/service/base.service';
import { CprEntity } from '../entities/cpr/cpr.entity';
import { CRUDRepository } from '../infra/repository/crud.repository';
import { CreditorService } from '../creditor/creditor.service';
import { EmitterService } from '../emitter/emitter.service';
import { DeliveryPlaceService } from '../delivery-place/delivery-place.service';
import { CprPhysicEntity } from 'src/entities/cpr/cpr-physic.entity';

interface ICprDocumentFactory {
  createDocument(cpr: CprPhysicEntity): ReadableStream;
}

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class CprService<T extends CprEntity> extends BaseService<CprEntity> {
  constructor(
    @Inject('KEY_REPOSITORY_CPR')
    protected readonly cprRepository: CRUDRepository<T>,
    @Inject('CPR_DOCUMENT_FACTORY')
    protected readonly cprDocumentFactory: ICprDocumentFactory,
    protected readonly creditorService: CreditorService,
    protected readonly emitterService: EmitterService,
    protected readonly deliveryPlaceService: DeliveryPlaceService,
  ) {
    super(cprRepository);
  }
}
