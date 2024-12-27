import { Module } from '@nestjs/common';
import { CreditorService } from './creditor.service';
import { CreditorController } from './creditor.controller';
import { InMemoryRepository } from '../infra/repository/in-memory/in-memory.repository';
import { CreditorEntity } from '../entities/person/creditor.entity';
import { StateEnum } from '../infra/entities/state-enum';
import { AddressEntity } from '../entities/person/address.entity';
import { CreditorModel } from './repository/creditor.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrediorRepository } from './repository/creditor.repository';
import { AddressModel } from '../infra/repository/typeORM/address.model';
import { LegalRepresentative } from '../entities/person/company.entity';

const mockAddress = AddressEntity.create({
  postalCode: '35585000',
  city: 'Pimenta',
  state: StateEnum.MG,
  publicArea: 'Rua Principal',
  number: '640',
  district: 'Centro',
  complement: 'apto 101',
  mailbox: '1234',
});

const mockCreditor = CreditorEntity.create({
  name: 'PMG Insumos',
  cnpj: '88457902000100',
  legalName: 'Agro Insumos LTDA',
  inscricaoEstadual: '1111111',
  phone: '37999334679',
  email: 'adm@pmginsumos.com',
  address: mockAddress,
  legalRepresentative: new LegalRepresentative(
    'Antônio Alvarenga Silva',
    '13527694099',
  ),
});

const repo = new InMemoryRepository<CreditorEntity>();

mockCreditor.id = '0190a308-15df-725b-a6f3-4c591248221b';

repo.insert(mockCreditor);

@Module({
  imports: [TypeOrmModule.forFeature([CreditorModel, AddressModel])],
  controllers: [CreditorController],
  providers: [
    CreditorService,
    {
      provide: 'KEY_REPOSITORY_CREDITOR',
      useClass: CrediorRepository,
    },
    // {
    //   provide: 'KEY_REPOSITORY_CREDITOR',
    //   useValue: repo,
    // },
  ],
  exports: [CreditorService],
})
export class CreditorModule {}
