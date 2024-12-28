import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from '../../infra/repository/typeORM/typeORM.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditorModel } from './creditor.model';
import { CreditorEntity } from 'src/entities/person/creditor.entity';
import { LegalRepresentative } from 'src/entities/person/company.entity';
import { AddressEntity } from 'src/entities/person/address.entity';

@Injectable()
export class CrediorRepository extends TypeORMRepository<CreditorEntity> {
  constructor(
    @InjectRepository(CreditorModel)
    private creditorRepository: Repository<CreditorModel>,
  ) {
    super(creditorRepository);
  }

  async getById(id: string): Promise<CreditorEntity> {
    const creditor = await this.creditorRepository.findOne({
      where: { id },
      relations: { address: true },
    });

    if (creditor) {
      return CreditorEntity.restore({
        ...creditor,
        legalRepresentative: new LegalRepresentative(
          creditor.legalRepresentativeName,
          creditor.legalRepresentativeCpf,
        ),
        address: AddressEntity.restore(creditor.address),
      });
    }
  }
}
