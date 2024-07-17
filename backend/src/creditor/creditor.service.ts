import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../infra/service/base.service';
import { CreditorEntity } from '../entities/person/creditor.entity';
import { CRUDRepository } from '../infra/repository/crud.repository';

@Injectable()
export class CreditorService extends BaseService<CreditorEntity> {
  constructor(
    @Inject('KEY_REPOSITORY_CREDITOR')
    private readonly creditoRepository: CRUDRepository<CreditorEntity>,
  ) {
    super(creditoRepository);
  }
}
