import { CompanyModel } from '../../infra/repository/typeORM/company.model';
import { CprModel } from '../../cpr/repository/cpr.model';
import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseModel } from '../../infra/repository/typeORM/base.model';
import { IndividualModel } from '../../infra/repository/typeORM/individual.model';
import { FarmModel } from './farm.model';

@Entity('emitter')
export class EmitterModel extends BaseModel {
  @OneToOne(() => CompanyModel)
  @JoinColumn()
  company: CompanyModel;

  @OneToOne(() => IndividualModel)
  @JoinColumn()
  individual: IndividualModel;

  @OneToMany(() => CprModel, (cpr) => cpr.creditor)
  cprs: CprModel[];

  @OneToMany(() => FarmModel, (farm) => farm.emitter)
  developmentSites: FarmModel[];
}
