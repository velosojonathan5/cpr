import { Module } from '@nestjs/common';
import { EmitterService } from './emitter.service';
import { EmitterController } from './emitter.controller';
import { InMemoryRepository } from '../infra/repository/in-memory/in-memory.repository';
import { EmitterEntity } from '../entities/person/emitter.entity';
import {
  GenderEnum,
  IndividualEntity,
  MaritalStatusEnum,
} from '../entities/person/individual.entity';
import { AddressEntity } from '../entities/person/address.entity';
import {
  FarmEntity,
  PossessionEnum,
  RegistryEntity,
} from '../entities/person/farm.entity';
import { StateEnum } from '../infra/entities/state-enum';

const mockIndividual = IndividualEntity.create({
  name: 'Galileo di Vincenzo Bonaulti de Galilei',
  phone: '37999888484',
  email: 'galileo@cientist.com',
  address: {} as unknown as AddressEntity,
  cpf: '54289266002',
  gender: GenderEnum.MALE,
  RG: 'MG574475',
  RGEmitedBy: 'SSP/SP',
  RGEmitedDate: new Date('2024-07-13T18:49:18.111Z'),
  maritalStatus: MaritalStatusEnum.SINGLE,
});

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

const mockRegistry = RegistryEntity.create({ number: 'MAT11333' });

const mockFarm = FarmEntity.create({
  name: 'Fazenda Dois Irmãos',
  cnpj: '67664457000171',
  legalName: 'Fazenda Dois Irmãos LTDA',
  inscricaoEstadual: '698468468',
  phone: '37999334671',
  email: 'fadois@gmail.com',
  address: mockAddress,
  legalRepresentative: undefined,
  tatalArea: 200,
  cultivatedArea: 1000,
  nirf: 'NIRF7700',
  possession: PossessionEnum.OWNER,
  registry: mockRegistry,
});

mockFarm.id = '0190c91f-6a4f-7bc8-8cca-ae6633e25c40';

const mockEmitter = EmitterEntity.create(mockIndividual, [mockFarm]);

mockEmitter.id = '0190ade6-7cd9-7552-b48e-dd2b561e06f3';

const repo = new InMemoryRepository<EmitterEntity>();

repo.insert(mockEmitter);

@Module({
  controllers: [EmitterController],
  providers: [
    EmitterService,
    {
      provide: 'KEY_REPOSITORY_EMITTER',
      useValue: repo,
    },
  ],
  exports: [EmitterService],
})
export class EmitterModule {}
