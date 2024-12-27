import { CprModel } from '../../cpr/repository/cpr.model';
import { CompanyModel } from '../../infra/repository/typeORM/company.model';
import { Entity, OneToMany } from 'typeorm';

@Entity('delivery_place')
export class DeliveryPlaceModel extends CompanyModel {
  @OneToMany(() => CprModel, (cpr) => cpr.creditor)
  cprs: CprModel[];
}
