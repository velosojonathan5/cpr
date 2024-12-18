import { CompanyEntity } from './company.entity';

export class CreditorEntity extends CompanyEntity {
  private constructor() {
    super();
  }

  static restore(obj: Partial<CreditorEntity>): CreditorEntity {
    return Object.assign(new CreditorEntity(), obj);
  }
}
