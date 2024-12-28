import { Column, Entity } from 'typeorm';
import { PersonModel } from './person.model';

@Entity('company')
export class CompanyModel extends PersonModel {
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
}
