import { CompanyEntity } from './company.entity';
import { IndividualEntity } from './individual.entity';
import { PersonEntity } from './person.entity';

export class EmitterEntity extends PersonEntity {
  individual?: IndividualEntity;
  company?: CompanyEntity;
  private _qualification: string;

  constructor(id: string) {
    super(id);
  }

  set qualification(q: string) {
    this._qualification = q;
  }

  get qualification(): string {
    return this._qualification;
  }

  static create(obj: IndividualEntity | CompanyEntity): EmitterEntity {
    const emitter = new EmitterEntity(obj.id);

    emitter.qualification = obj.qualification;
    emitter.name = obj.name;
    emitter.phone = obj.phone;
    emitter.email = obj.email;
    emitter.address = obj.address;

    if (obj instanceof IndividualEntity) {
      emitter.individual = obj;
    } else if (obj instanceof CompanyEntity) {
      emitter.company = obj;
    }

    return emitter;
  }
}
