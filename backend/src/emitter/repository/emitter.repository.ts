import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from '../../infra/repository/typeORM/typeORM.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CompanyEntity,
  LegalRepresentative,
} from 'src/entities/person/company.entity';
import { AddressEntity } from 'src/entities/person/address.entity';
import { EmitterModel } from './emitter.model';
import { EmitterEntity } from '../../entities/person/emitter.entity';
import {
  FarmEntity,
  RentRegistry,
  SiteRegistry,
} from '../../entities/person/farm.entity';
import {
  IndividualEntity,
  SpouseEntity,
} from 'src/entities/person/individual.entity';

@Injectable()
export class EmitterRepository extends TypeORMRepository<EmitterEntity> {
  constructor(
    @InjectRepository(EmitterModel)
    private emitterRepository: Repository<EmitterModel>,
  ) {
    super(emitterRepository);
  }

  async getById(id: string): Promise<EmitterEntity> {
    const emitter = await this.emitterRepository.findOne({
      where: { id },
      relations: {
        company: { address: true },
        individual: { address: true },
        developmentSites: {
          address: true,
          siteRegistry: { address: true },
          rentRegistry: { address: true },
        },
      },
    });

    const developmentSites = emitter.developmentSites.map((d) => {
      const address = AddressEntity.restore(d.address);
      let siteRegistry: SiteRegistry;
      let rentRegistry: RentRegistry;

      if (d.siteRegistry) {
        siteRegistry = SiteRegistry.restore({
          ...d.siteRegistry,
          address: d.siteRegistry.address
            ? AddressEntity.restore(d.siteRegistry.address)
            : undefined,
        });
      }
      if (d.rentRegistry) {
        rentRegistry = RentRegistry.restore({
          ...d.rentRegistry,
          address: d.rentRegistry.address
            ? AddressEntity.restore(d.rentRegistry.address)
            : undefined,
        });
      }

      return FarmEntity.restore({
        ...d,
        address,
        siteRegistry,
        rentRegistry,
      });
    });

    if (emitter.company) {
      const { company } = emitter;

      const companyEmitter = CompanyEntity.restore({
        ...company,
        legalRepresentative: new LegalRepresentative(
          company.legalRepresentativeName,
          company.legalRepresentativeCpf,
        ),
        address: AddressEntity.restore(company.address),
      });

      return EmitterEntity.create(companyEmitter, developmentSites);
    }

    if (emitter.individual) {
      const { individual } = emitter;
      let spouse: SpouseEntity | undefined;

      if (individual.spouse) {
        spouse = SpouseEntity.restore({
          ...individual.spouse,
        });
      }

      const individualEmitter = IndividualEntity.restore({
        ...individual,
        address: AddressEntity.restore(individual.address),
        spouse,
      });

      return EmitterEntity.create(individualEmitter, developmentSites);
    }
  }
}
