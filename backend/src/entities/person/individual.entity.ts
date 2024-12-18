import { FormatterUtil } from '../../util/formatter.util';
import { AddressEntity } from './address.entity';
import { PersonEntity } from './person.entity';

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum MaritalStatusEnum {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWER = 'WIDOWER',
  SEPARATE = 'SEPARATE',
}

export enum MatrimonialRegimeEnum {
  PARTIAL_COMMUNION = 'PARTIAL_COMMUNION',
  UNIVERSAL_COMMINUION = 'UNIVERSAL_COMMINUION',
  TOTAL_SEPARATION = 'TOTAL_SEPARATION',
  MANDATORY_SEPARATION = 'MANDATORY_SEPARATION',
  FINAL_PARTCIPATION = 'FINAL_PARTCIPATION',
}

const MARITAL_STATUS_MAP = {
  [MaritalStatusEnum.SINGLE]: 'solteiro',
  [MaritalStatusEnum.MARRIED]: 'casado',
  [MaritalStatusEnum.DIVORCED]: 'divorciado',
  [MaritalStatusEnum.WIDOWER]: 'viúvo',
  [MaritalStatusEnum.SEPARATE]: 'separado',
};

const MATRIMONIAL_REGIME_MAP = {
  [MatrimonialRegimeEnum.PARTIAL_COMMUNION]: 'comunhão parcial de bens',
  [MatrimonialRegimeEnum.UNIVERSAL_COMMINUION]: 'comunhão universal de bens',
  [MatrimonialRegimeEnum.TOTAL_SEPARATION]:
    'separação total/convencional de bens',
  [MatrimonialRegimeEnum.MANDATORY_SEPARATION]: 'separação obrigatória de bens',
  [MatrimonialRegimeEnum.FINAL_PARTCIPATION]: 'participação final nos aquestos',
};

export class Rg {
  number: string;
  emitedBy: string;
  emitedDate: Date;

  constructor(number: string, emitedBy: string, emitedDate: Date) {
    this.number = number;
    this.emitedBy = emitedBy;
    this.emitedDate = emitedDate;
  }

  get qualification(): string {
    return `portador(a) da cédula de identidade nº ${this.number}, ${this.emitedBy}, expedida em ${FormatterUtil.formatDateBR(this.emitedDate)}`;
  }
}

export class IndividualEntity extends PersonEntity {
  cpf: string;
  gender?: GenderEnum;
  rg?: Rg;
  maritalStatus?: MaritalStatusEnum;
  matrimonialRegime?: MatrimonialRegimeEnum;
  spouse?: IndividualEntity;
  profession?: string;

  protected constructor() {
    super();
  }

  get qualification(): string {
    let spouseText = '';
    let rgQualification = '';

    if (this.isMarried) {
      spouseText = `, casado(a) sob o regime de ${MATRIMONIAL_REGIME_MAP[this.matrimonialRegime]} com ${this.spouse.qualification}`;
    }

    const professionText = this.profession ? ` ${this.profession},` : '';

    if (this.rg) {
      rgQualification = ` ${this.rg.qualification},`;
    }

    return `${this.name}, Brasileiro(a), ${MARITAL_STATUS_MAP[this.maritalStatus]}(a),${professionText}${rgQualification} inscrito (a) no
      CPF nº ${FormatterUtil.formatCPF(this.cpf)}, telefone de contato: ${FormatterUtil.formatPhone(this.phone)}, e-mail: ${this.email}, residente
      domiciliado(a) na cidade de ${this.address.qualification}${spouseText}.`;
  }

  get isMarried(): boolean {
    return this.maritalStatus === MaritalStatusEnum.MARRIED;
  }

  static create(obj: {
    name: string;
    phone: string;
    email: string;
    address?: AddressEntity;
    cpf: string;
    gender: string;
    rg: { number: string; emitedBy: string; emitedDate: Date };
    maritalStatus: MaritalStatusEnum;
    matrimonialRegime?: MatrimonialRegimeEnum;
    spouse?: SpouseEntity;
    profession?: string;
  }): IndividualEntity {
    const {
      name,
      phone,
      email,
      address,
      cpf,
      gender,
      rg,
      maritalStatus,
      matrimonialRegime,
      spouse,
      profession,
    } = obj;

    const individual = Object.assign(new IndividualEntity(), {
      name,
      phone,
      email,
      address,
      cpf,
      gender,
      rg,
      maritalStatus,
      matrimonialRegime,
      spouse,
      profession,
    });

    if (individual.isMarried && !spouse) {
      throw new Error('Para indivíduo casado deve ser informado o cônjuge.');
    }

    if (individual.isMarried && !matrimonialRegime) {
      throw new Error('Para indivíduo casado deve ser o regime matrimonial.');
    }

    return individual;
  }

  static restore(obj: unknown): IndividualEntity {
    return Object.assign(new IndividualEntity(), obj);
  }
}

export class SpouseEntity extends PersonEntity {
  cpf: string;
  rg: Rg;

  static create(obj: {
    name: string;
    cpf: string;
    rg?: { number: string; emitedBy: string; emitedDate: Date };
  }): SpouseEntity {
    const { name, cpf, rg } = obj;

    const spouse = Object.assign(new SpouseEntity(), {
      name,
      cpf,
      rg,
    });

    return spouse;
  }

  get qualification(): string {
    let rgQualification = '';

    if (this.rg) {
      rgQualification = this.rg.qualification + ',';
    }

    return `${this.name},
      ${rgQualification} 
      inscrito(a) no CPF nº ${FormatterUtil.formatCPF(this.cpf)}`;
  }

  static restore(obj: unknown): SpouseEntity {
    return Object.assign(new SpouseEntity(), obj);
  }
}
