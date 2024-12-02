import { FormatterUtil } from '../../util/formatter.util';
import { TenantEntity } from '../../infra/entities/tenant.entity';
import { CreditorEntity } from '../person/creditor.entity';
import { EmitterEntity } from '../person/emitter.entity';
import { GuarantorEntity } from '../person/guarantor.entity';
import { ProductEntity } from '../product.entity';
import { FarmEntity } from '../person/farm.entity';
import { CompanyEntity } from '../person/company.entity';
import { BadRequestException } from '@nestjs/common';

export class PaymentEntity extends TenantEntity {
  dueDate: Date;
  value: number;

  get dueDateFormatted() {
    return FormatterUtil.formatDateBR(this.dueDate);
  }

  get valueFormatted() {
    return FormatterUtil.toBRL(this.value);
  }

  private constructor() {
    super();
  }

  get qualification(): string {
    return `${this.valueFormatted} com vencimento em ${this.dueDateFormatted}`;
  }

  static create(dueDate: Date, value: number): PaymentEntity {
    return Object.assign(new PaymentEntity(), { dueDate, value });
  }
}

export enum ResponsibleForExpensesEnum {
  CREDITOR = 'CREDITOR',
  EMITTER = 'EMITTER',
}

export class CprEntity extends TenantEntity {
  number: string;
  creditor: CreditorEntity;
  emitter: EmitterEntity;
  guarantor?: GuarantorEntity;
  product: ProductEntity;
  crop: string;
  quantity: number;
  productDevelopmentSite: FarmEntity;
  paymentSchedule: PaymentEntity[];
  deliveryPlace: CompanyEntity;
  value: number;
  issueDate: Date;
  responsibleForExpenses: ResponsibleForExpensesEnum;
  signedUrl?: string;

  get sacas(): number {
    return this.quantity / 60;
  }

  get sacasFormatted(): string {
    return FormatterUtil.toNumberPTBR(this.sacas, 2);
  }

  get quantityFormatted(): string {
    return FormatterUtil.toNumberPTBR(this.quantity);
  }

  get issueDateFormatted(): string {
    return FormatterUtil.formatDateBR(this.issueDate);
  }

  get paymentScheduleText(): string {
    const text = this.paymentSchedule.map(
      (p, i) => i + 1 + 'ª parcela de ' + p.qualification,
    );
    return text.join(', ');
  }

  get responsibleForExpensesText() {
    const options = {
      [ResponsibleForExpensesEnum.CREDITOR]:
        'Do preço definitivo fixado conforme acima, a CREDORA já efetuou as retenções determinadas pela legislação vigente, quer sejam decorrentes de legislação federal, estadual ou municipal.',
      [ResponsibleForExpensesEnum.EMITTER]: `O EMITENTE declara ter pleno conhecimento, e estar de pleno acordo, de que a CREDORA, efetuará uma retenção em reais, de acordo com sua tabela de descontos, destinada a remuneração dos serviços de entrega da mercadoria no ${this.deliveryPlace.legalName}, tais como: despesas de recebimento, limpeza, secagem da mercadoria; despesas de armazenagem e expedição da mercadoria; e todas as demais despesas operacionais e margem da CREDORA.`,
    };

    return options[this.responsibleForExpenses];
  }

  protected constructor() {
    super();

    this.issueDate = new Date();
    this.generateNumber();
  }

  // TODO verificar possibilidade de melhorar para um numero mais enxuto
  private generateNumber(): void {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');

    const formatedDate = `${year}${month}${day}${hour}${minute}${second}`;

    const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);

    this.number = `${formatedDate}${numeroAleatorio}`;
  }

  get valueFormatted(): string {
    return FormatterUtil.toBRL(this.value);
  }

  static create(obj: Partial<CprEntity>): CprEntity {
    const {
      creditor,
      emitter,
      guarantor,
      product,
      crop,
      quantity,
      productDevelopmentSite,
      paymentSchedule,
      deliveryPlace,
      value,
      responsibleForExpenses,
    } = obj;

    const cpr = Object.assign(new CprEntity(), {
      creditor,
      emitter,
      guarantor,
      product,
      crop,
      quantity,
      productDevelopmentSite,
      paymentSchedule,
      deliveryPlace,
      value,
      responsibleForExpenses,
    });

    let sumPaymentSchedule = 0;
    for (const p of cpr.paymentSchedule) {
      sumPaymentSchedule += p.value;
    }

    if (sumPaymentSchedule !== cpr.value) {
      throw new BadRequestException(
        'A soma dos valores do cronograma de pagamentos deve ser igual ao valor da CPR.',
      );
    }

    return cpr;
  }
}
