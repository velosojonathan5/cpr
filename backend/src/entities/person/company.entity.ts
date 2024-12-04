import { FormatterUtil } from '../../util/formatter.util';
import { AddressEntity } from './address.entity';
import { PersonEntity } from './person.entity';

export class LegalRepresentative {
  name: string;
  cpf: string;

  constructor(name: string, cpf: string) {
    this.name = name;
    this.cpf = cpf;
  }
}

export class CompanyEntity extends PersonEntity {
  cnpj: string;
  legalName: string;
  inscricaoEstadual: string;
  legalRepresentative?: LegalRepresentative;

  protected constructor() {
    super();
  }

  get qualification(): string {
    let legalRepresentativeText = '';

    if (this.legalRepresentative) {
      legalRepresentativeText = ` representada neste ato pelo seu Sócio Administrador ${this.legalRepresentative.name} portador de CPF ${FormatterUtil.formatCPF(this.legalRepresentative.cpf)}.`;
    }

    return `${this.legalName}, pessoa jurídica de direito privado, inscrita no CNPJ ${FormatterUtil.formatCNPJ(this.cnpj)} e inscrição
      estadual nº ${this.inscricaoEstadual}, com sede na cidade de ${this.address.qualification}, telefone de contato
      ${FormatterUtil.formatPhone(this.phone)}, e-mail: ${this.email};${legalRepresentativeText}`;
  }

  static create(obj: {
    name: string;
    cnpj: string;
    legalName: string;
    inscricaoEstadual: string;
    phone: string;
    email: string;
    address: AddressEntity;
    legalRepresentative?: LegalRepresentative;
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
