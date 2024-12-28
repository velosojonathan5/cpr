import { PersonModel } from '../../infra/repository/typeORM/person.model';
import { CprModel } from '../../cpr/repository/cpr.model';
import { CompanyModel } from '../../infra/repository/typeORM/company.model';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('delivery_place')
export class DeliveryPlaceModel extends PersonModel implements CompanyModel {
  @Column({ name: 'cnpj' })
  cnpj: string;

  @Column({ name: 'legal_name' })
  legalName: string;

  @Column({ name: 'inscricao_estadual' })
  inscricaoEstadual: string;

  @Column({ name: 'legal_representative_name', nullable: true })
  legalRepresentativeName?: string;

  @Column({ name: 'legal_representative_cpf', nullable: true })
  legalRepresentativeCpf?: string;

  @OneToMany(() => CprModel, (cpr) => cpr.creditor)
  cprs: CprModel[];
}
