import { Module } from '@nestjs/common';
import { CreditorService } from './creditor.service';
import { CreditorController } from './creditor.controller';
import { InMemoryRepository } from '../infra/repository/in-memory/in-memory.repository';
import { CreditorEntity } from '../entities/person/creditor.entity';
import { StateEnum } from '../infra/entities/state-enum';
import { AddressEntity } from '../entities/person/address.entity';
import {
  GenderEnum,
  IndividualEntity,
  MaritalStatusEnum,
  Rg,
} from '../entities/person/individual.entity';

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

const mockLegalRepresentative = IndividualEntity.create({
  cpf: '13527694099',
  gender: GenderEnum.MALE,
  name: 'Antônio Alvarenga Silva',
  phone: '37999332222',
  email: 'antonio@pmginsumos.com',
  rg: new Rg('MG111', 'SSP/MG', new Date('2024-07-13T18:49:18.111Z')),
  maritalStatus: MaritalStatusEnum.SINGLE,
});

const mockCreditor = CreditorEntity.create({
  name: 'PMG Insumos',
  cnpj: '88457902000100',
  legalName: 'Agro Insumos LTDA',
  inscricaoEstadual: '1111111',
  phone: '37999334679',
  email: 'adm@pmginsumos.com',
  address: mockAddress,
  legalRepresentative: mockLegalRepresentative,
});

const repo = new InMemoryRepository<CreditorEntity>();

mockCreditor.id = '0190a308-15df-725b-a6f3-4c591248221b';

repo.insert(mockCreditor);

@Module({
  controllers: [CreditorController],
  providers: [
    CreditorService,
    {
      provide: 'KEY_REPOSITORY_CREDITOR',
      useValue: repo,
    },
  ],
  exports: [CreditorService],
})
export class CreditorModule {}
