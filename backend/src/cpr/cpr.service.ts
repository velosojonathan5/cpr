import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../infra/service/base.service';
import { CprEntity } from '../entities/cpr/cpr.entity';
import { CRUDRepository } from '../infra/repository/crud.repository';
import { CreditorService } from '../creditor/creditor.service';
import { EmitterService } from '../emitter/emitter.service';

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class CprService<T extends CprEntity> extends BaseService<CprEntity> {
  constructor(
    @Inject('KEY_REPOSITORY_CPR')
    protected readonly cprRepository: CRUDRepository<T>,
    protected readonly creditorService: CreditorService,
    protected readonly emitterService: EmitterService,
  ) {
    super(cprRepository);
  }
}
