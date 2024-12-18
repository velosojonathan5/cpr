import { CprModel } from '../../cpr/repository/cpr.model';
import { CompanyModel } from '../../infra/repository/typeORM/company.model';
import { Entity, OneToMany } from 'typeorm';

@Entity('creditor')
export class CreditorModel extends CompanyModel {
  @OneToMany(() => CprModel, (cpr) => cpr.creditor)
  cprs: CprModel[];
}
