import { FormatterUtil } from '../../util/formatter.util';
import { AddressEntity } from './address.entity';
import { IndividualEntity } from './individual.entity';
import { PersonEntity } from './person.entity';

export class CompanyEntity extends PersonEntity {
  cnpj: string;
  legalName: string;
  inscricaoEstadual: string;
  legalRepresentative: IndividualEntity;

  protected constructor() {
    super();
  }

  get qualification(): string {
    return `${this.legalName}, pessoa jurídica de direito privado, inscrita no CNPJ ${FormatterUtil.formatCNPJ(this.cnpj)} e inscrição
      estadual nº ${this.inscricaoEstadual}, com sede na cidade de ${this.address.qualification}, telefone de contato
      ${FormatterUtil.formatPhone(this.phone)}, e-mail: ${this.email}; representada neste ato pelo seu Sócio Administrador ${this.legalRepresentative.name} portador de CPF ${FormatterUtil.formatCPF(this.legalRepresentative.cpf)}.`;
  }

  static create(obj: {
    name: string;
    cnpj: string;
    legalName: string;
    inscricaoEstadual: string;
    phone: string;
    email: string;
    address: AddressEntity;
    legalRepresentative: IndividualEntity;
  }): CompanyEntity {
    const {
      name,
      cnpj,
      legalName,
      inscricaoEstadual,
      phone,
      email,
      address,
      legalRepresentative,
    } = obj;
    return Object.assign(new CompanyEntity(), {
      name,
      cnpj,
      legalName,
      inscricaoEstadual,
      phone,
      email,
      address,
      legalRepresentative,
    });
  }
}
