import { BadRequestException } from '@nestjs/common';
import { CompanyEntity } from './company.entity';
import { FarmEntity } from './farm.entity';
import { IndividualEntity } from './individual.entity';
import { PersonEntity } from './person.entity';

export class EmitterEntity extends PersonEntity {
  individual?: IndividualEntity;
  company?: CompanyEntity;
  developmentSites: FarmEntity[];
  private _qualification: string;

  private constructor(id?: string) {
    super(id);
  }

  set qualification(q: string) {
    this._qualification = q;
  }

  get qualification(): string {
    return this._qualification;
  }

  getDevelopmentSite(id: string): FarmEntity {
    const site = this.developmentSites.filter((d) => d.id === id)[0];

    if (!site) {
      throw new BadRequestException('Local de produção não encontrado');
    }

    return site;
  }

  static create(
    obj: IndividualEntity | CompanyEntity,
    developmentSites: FarmEntity[],
  ): EmitterEntity {
    const emitter = new EmitterEntity(obj.id);

    emitter.qualification = obj.qualification;
    emitter.name = obj.name;
    emitter.phone = obj.phone;
    emitter.email = obj.email;
    emitter.address = obj.address;
    emitter.developmentSites = developmentSites;

    if (obj instanceof IndividualEntity) {
      emitter.individual = obj;
    } else if (obj instanceof CompanyEntity) {
      emitter.company = obj;
    }

    return emitter;
  }
}
