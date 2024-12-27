import { Module } from '@nestjs/common';
import { DeliveryPlaceService } from './delivery-place.service';
import { DeliveryPlaceController } from './delivery-place.controller';
import { InMemoryRepository } from '../infra/repository/in-memory/in-memory.repository';
import { CompanyEntity } from '../entities/person/company.entity';
import { AddressEntity } from '../entities/person/address.entity';
import { StateEnum } from '../infra/entities/state-enum';
import { DeliveryPlaceRepository } from './repository/delivery-place.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryPlaceModel } from './repository/delivery-place.model';
import { AddressModel } from '../infra/repository/typeORM/address.model';

const repo = new InMemoryRepository<CompanyEntity>();

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

const mockDeliveryPlace = CompanyEntity.create({
  name: 'Fazenda dos Patos 2',
  cnpj: '44561357000114',
  legalName: 'Fazenda dos Patos LTDA',
  inscricaoEstadual: '1111111',
  phone: '37999334679',
  email: 'adm@pmginsumos.com',
  address: mockAddress,
});

mockDeliveryPlace.id = '0190cc93-e9eb-75ba-87a2-8a0a024540c0';

repo.insert(mockDeliveryPlace);

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryPlaceModel, AddressModel])],
  controllers: [DeliveryPlaceController],
  providers: [
    DeliveryPlaceService,
    // {
    //   provide: 'KEY_REPOSITORY_DELIVERY_PLACE',
    //   useValue: repo,
    // },
    {
      provide: 'KEY_REPOSITORY_DELIVERY_PLACE',
      useClass: DeliveryPlaceRepository,
    },
  ],
  exports: [DeliveryPlaceService],
})
export class DeliveryPlaceModule {}
