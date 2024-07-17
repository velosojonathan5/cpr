import { FormatterUtil } from '../../util/formatter.util';
import { StateEnum } from '../../infra/entities/state-enum';
import { TenantEntity } from '../../infra/entities/tenant.entity';

export class AddressEntity extends TenantEntity {
  postalCode: string;
  city: string;
  state: StateEnum;
  publicArea: string;
  number: string;
  complement?: string;
  district: string;
  mailbox?: string;

  protected constructor() {
    super();
  }

  get qualification(): string {
    const complementText = this.complement ? `, ${this.complement}` : '';
    const mailboxText = this.mailbox ? `, (${this.mailbox})` : '';

    return `${this.city}/${this.state}, à ${this.publicArea}, nº
      ${this.number}${complementText}${mailboxText} - Bairro: ${this.district}, CEP: ${FormatterUtil.formatPostalCode(this.postalCode)}`;
  }

  static create(obj: {
    postalCode: string;
    city: string;
    state: string;
    publicArea: string;
    number: string;
    complement?: string;
    district: string;
    mailbox?: string;
  }) {
    return Object.assign(new AddressEntity(), obj);
  }
}
