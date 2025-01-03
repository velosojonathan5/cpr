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
} from '../entities/person/farm.entity';
import { StateEnum } from '../infra/entities/state-enum';
import { EmitterRepository } from './repository/emitter.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmitterModel } from './repository/emitter.model';
import { SpouseModel } from '../infra/repository/typeORM/spouse.model';
import { CompanyModel } from 'src/infra/repository/typeORM/company.model';
import { IndividualModel } from 'src/infra/repository/typeORM/individual.model';
import { FarmModel } from './repository/farm.model';
import { RentRegistryModel } from './repository/rent-registry.model';
import { SiteRegistryModel } from './repository/site-registry.model';

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

const mockIndividual = IndividualEntity.create({
  name: 'Galileo di Vincenzo Bonaulti de Galilei',
  phone: '37999888484',
  email: 'galileo@cientist.com',
  address: mockAddress,
  cpf: '54289266002',
  gender: GenderEnum.MALE,
  rg: new Rg('MG574475', 'SSP/SP', new Date('2024-07-13T18:49:18.111Z')),
  maritalStatus: MaritalStatusEnum.SINGLE,
});

const mockRegistry = SiteRegistry.create({
  number: 'PROP11333',
  regitryPlaceName: 'Cartório da comarca',
  address: mockAddress,
  book: 'Livro BH',
  sheet: 'Folha 145',
  regitryDate: new Date('2024-07-13T18:49:18.111Z'),
});

/*
const mockRentRegistry = RentRegistry.create({
  number: 'ARRED11333',
  initialDate: new Date('2024-07-13T18:49:18.111Z'),
  finalDate: new Date('2024-07-13T18:49:18.111Z'),
  regitryPlaceName: 'Cartório da comarca',
  address: mockAddress,
  book: 'Livro BH',
  sheet: 'Folha 145',
  regitryDate: new Date('2024-07-13T18:49:18.111Z'),
});
*/

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
  possession: PossessionEnum.OWNER,
  siteRegistry: mockRegistry,
});

mockFarm.id = '0190c91f-6a4f-7bc8-8cca-ae6633e25c40';

const mockEmitter = EmitterEntity.create(mockIndividual, [mockFarm]);

mockEmitter.id = '0190ade6-7cd9-7552-b48e-dd2b561e06f3';

const repo = new InMemoryRepository<EmitterEntity>();

repo.insert(mockEmitter);

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmitterModel,
      CompanyModel,
      IndividualModel,
      SpouseModel,
      FarmModel,
      RentRegistryModel,
      SiteRegistryModel,
    ]),
  ],
  controllers: [EmitterController],
  providers: [
    EmitterService,
    // {
    //   provide: 'KEY_REPOSITORY_EMITTER',
    //   useValue: repo,
    // },
    {
      provide: 'KEY_REPOSITORY_EMITTER',
      useClass: EmitterRepository,
    },
  ],
  exports: [EmitterService],
})
export class EmitterModule {}
