import { FormatterUtil } from '../../util/formatter.util';
import { TenantEntity } from '../../infra/entities/tenant.entity';
import { AddressEntity } from './address.entity';
import { IndividualEntity } from './individual.entity';

export class RegistryEntity extends TenantEntity {
  number: string;
  regitryPlaceName?: string;
  address?: AddressEntity;
  book?: string;
  sheet?: string;
  regitryDate?: Date;

  private get regitryDateFormatted(): string {
    if (this.regitryDate) {
      return FormatterUtil.formatDateBR(this.regitryDate);
    }
    return '';
  }

  protected constructor() {
    super();
  }

  get qualifications(): { label: string; content: string }[] {
    const qualifications = [
      {
        label: 'Número da matrícula',
        content: this.number,
      },
    ];

    if (this.regitryPlaceName && this.address) {
      qualifications.push({
        label: 'Cartório de registro da matrícula',
        content: `${this.regitryPlaceName}, ${this.address ? this.address.city : ''}/${this.address ? this.address.state : ''}`,
      });
    }

    if (this.book && this.sheet) {
      qualifications.push({
        label: 'Livro e folha de registro da matrícula',
        content: `Livro ${this.book} na folha ${this.sheet}`,
      });
    }

    if (this.regitryDate) {
      qualifications.push({
        label: 'Data de registro da matrícula',
        content: this.regitryDateFormatted,
      });
    }

    return qualifications;
  }

  static create(obj: Partial<RegistryEntity>) {
    return Object.assign(new RegistryEntity(), {
      number: obj.number,
      regitryPlaceName: obj.regitryPlaceName,
      address: obj.address,
      book: obj.book,
      sheet: obj.sheet,
      regitryDate: obj.regitryDate,
    });
  }
}

export enum PossessionEnum {
  OWNER = 'OWNER',
  RENT = 'RENT',
}

const POSSESSION_MAP = {
  [PossessionEnum.OWNER]: 'proprietário',
  [PossessionEnum.RENT]: 'Arrendatário',
};

export class RentRegistry extends RegistryEntity {
  initialDate: Date;
  finalDate: Date;

  private get initialDateFormatted() {
    return FormatterUtil.formatDateBR(this.initialDate);
  }

  private get finalDateFormatted() {
    return FormatterUtil.formatDateBR(this.finalDate);
  }

  protected constructor() {
    super();
  }

  static create(obj: Partial<RentRegistry>) {
    const registry = RegistryEntity.create(obj);

    return Object.assign(new RentRegistry(), {
      ...registry,
      initialDate: obj.initialDate,
      finalDate: obj.finalDate,
    });
  }

  get qualifications(): { label: string; content: string }[] {
    return super.qualifications
      .map((q) => {
        return { ...q, label: q.label + ' do arrendamento' };
      })
      .concat([
        {
          label: 'Data do início do contrato de arrendamento:',
          content: this.initialDateFormatted,
        },
        {
          label: 'Data do fim do contrato de arrendamento',
          content: this.finalDateFormatted,
        },
      ]);
  }
}

export class FarmEntity extends TenantEntity {
  name: string;
  inscricaoEstadual: string;
  address: AddressEntity;
  tatalArea: number;
  cultivatedArea: number;
  nirf: string;
  possession: PossessionEnum;
  registry: RegistryEntity;
  rentRegistry?: RentRegistry;

  get isRent(): boolean {
    return this.possession === PossessionEnum.RENT;
  }

  get tatalAreaFormatted(): string {
    return FormatterUtil.toNumberPTBR(this.tatalArea);
  }

  get cultivatedAreaFormatted(): string {
    return FormatterUtil.toNumberPTBR(this.cultivatedArea);
  }

  private constructor() {
    super();
  }

  get qualifications(): { label: string; content: string }[] {
    let qualifications = [
      {
        label: 'Imóvel rural',
        content: this.name,
      },
      {
        label: 'Inscrição Estadual',
        content: this.inscricaoEstadual,
      },
      {
        label: 'Localização do imóvel rural',
        content: this.address.qualification,
      },
      {
        label: 'Área total em hectares',
        content: this.tatalAreaFormatted,
      },
      {
        label: 'Área cultivada em hectares',
        content: this.cultivatedAreaFormatted,
      },
      {
        label: 'NIRF',
        content: this.nirf,
      },
      {
        label: 'Posse',
        content: POSSESSION_MAP[this.possession],
      },
    ];

    qualifications = qualifications.concat(this.registry.qualifications);

    if (this.isRent) {
      qualifications = qualifications.concat(this.rentRegistry.qualifications);
    }

    return qualifications;
  }

  static create(obj: {
    name: string;
    inscricaoEstadual: string;
    phone: string;
    email: string;
    address: AddressEntity;
    legalRepresentative: IndividualEntity;
    tatalArea: number;
    cultivatedArea: number;
    nirf: string;
    possession: PossessionEnum;
    registry: RegistryEntity;
  }): FarmEntity {
    const {
      name,
      inscricaoEstadual,
      phone,
      email,
      address,
      legalRepresentative,
      tatalArea,
      cultivatedArea,
      nirf,
      possession,
      registry,
    } = obj;
    return Object.assign(new FarmEntity(), {
      name,
      inscricaoEstadual,
      phone,
      email,
      address,
      legalRepresentative,
      tatalArea,
      cultivatedArea,
      nirf,
      possession,
      registry,
    });
  }
}
