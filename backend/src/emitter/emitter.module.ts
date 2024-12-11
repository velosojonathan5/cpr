import { Module } from '@nestjs/common';
import { EmitterService } from './emitter.service';
import { EmitterController } from './emitter.controller';
import { InMemoryRepository } from '../infra/repository/in-memory/in-memory.repository';
import { EmitterEntity } from '../entities/person/emitter.entity';
import {
  GenderEnum,
  IndividualEntity,
  MaritalStatusEnum,
  Rg,
} from '../entities/person/individual.entity';
import { AddressEntity } from '../entities/person/address.entity';
import {
  FarmEntity,
  PossessionEnum,
  SiteRegistry,
  RentRegistry,
} from '../entities/person/farm.entity';
import { StateEnum } from '../infra/entities/state-enum';

const mockIndividual = IndividualEntity.create({
  name: 'Galileo di Vincenzo Bonaulti de Galilei',
  phone: '37999888484',
  email: 'galileo@cientist.com',
  address: AddressEntity.create({
    postalCode: '30325310',
    city: 'Araguari',
    state: 'SP',
    publicArea: 'Rua Carlos Henrique',
    district: 'Centro',
  }),
  cpf: '54289266002',
  gender: GenderEnum.MALE,
  rg: new Rg('MG574475', 'SSP/SP', new Date('2024-07-13T18:49:18.111Z')),
  maritalStatus: MaritalStatusEnum.SINGLE,
});

const mockAddress = AddressEntity.create({
  postalCode: '35585000',
  city: 'Pimenta',
  state: StateEnum.MG,
  publicArea: 'Rua Principal',
  number: '640',
  district: 'Zona Rural'
});

const mockRegistry = SiteRegistry.create({ 
  number: 'PROP11333', 
  regitryPlaceName:'Cartório de registros',
  address: mockAddress,
  book: '5000',
  sheet: '145',
  regitryDate: new Date('2022-07-13T18:49:18.111Z'),
});

const mockRentRegistry = RentRegistry.create({ 
  number: 'ARRED11333', 
  initialDate: new Date('2023-07-13T18:49:18.111Z'),
  finalDate: new Date('2026-07-13T18:49:18.111Z'),
  regitryPlaceName:'Cartório de registros de arrendamento',
  address: mockAddress,
  book: '5000',
  sheet: '145',
  regitryDate: new Date('2023-07-13T18:49:18.111Z'),
});

const mockFarm = FarmEntity.create({
  name: 'Fazenda Dois Irmãos',
  inscricaoEstadual: '698468468',
  phone: '37999334671',
  email: 'fadois@gmail.com',
  address: mockAddress,
  legalRepresentative: undefined,
  tatalArea: 200,
  cultivatedArea: 1000,
  nirf: 'NIRF7700',
  possession: PossessionEnum.RENT,
  rentRegistry: mockRentRegistry,
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
