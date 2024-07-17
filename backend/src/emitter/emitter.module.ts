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
import { AddressEntity } from 'src/entities/person/address.entity';

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

const mockEmitter = EmitterEntity.create(mockIndividual);

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
