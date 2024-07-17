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

export class IndividualEntity extends PersonEntity {
  cpf: string;
  gender: GenderEnum;
  RG: string;
  RGEmitedBy: string;
  RGEmitedDate: Date;
  maritalStatus: MaritalStatusEnum;
  matrimonialRegime?: MatrimonialRegimeEnum;
  spouse?: IndividualEntity;
  profession?: string;

  protected constructor() {
    super();
  }

  get qualification(): string {
    let spouseText = '';

    if (this.isMarried) {
      spouseText = `, casado(a) sob o regime de ${MATRIMONIAL_REGIME_MAP[this.matrimonialRegime]} com ${this.spouse.name},
      portador(a) da cédula de identidade nº ${this.spouse.RG}, ${this.spouse.RGEmitedBy}, expedida em ${FormatterUtil.formatDateBR(this.spouse.RGEmitedDate)}, 
      inscrito(a) no CPF nº ${FormatterUtil.formatCPF(this.spouse.cpf)}`;
    }

    const professionText = this.profession ? ` ${this.profession},` : '';

    return `${this.name}, Brasileiro(a), ${MARITAL_STATUS_MAP[this.maritalStatus]}(a),${professionText} portador(a) da cédula de identidade
      nº ${this.RG}, ${this.RGEmitedBy}, expedida em ${FormatterUtil.formatDateBR(this.RGEmitedDate)}, inscrito (a) no
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
    RG: string;
    RGEmitedBy: string;
    RGEmitedDate: Date;
    maritalStatus: MaritalStatusEnum;
    matrimonialRegime?: MatrimonialRegimeEnum;
    spouse?: IndividualEntity;
    profession?: string;
  }): IndividualEntity {
    const {
      name,
      phone,
      email,
      address,
      cpf,
      gender,
      RG,
      RGEmitedBy,
      RGEmitedDate,
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
      RG,
      RGEmitedBy,
      RGEmitedDate,
      maritalStatus,
      matrimonialRegime,
      spouse,
      profession,
    });

    // if (individual.isMarried && !spouse) {
    //   throw new Error('Para indivíduo casado deve ser informado o cônjuge.');
    // }

    if (individual.isMarried && !matrimonialRegime) {
      throw new Error('Para indivíduo casado deve ser o regime matrimonial.');
    }

    return individual;
  }
}
