import { FormatterUtil } from '../../util/formatter.util';
import { TenantEntity } from '../../infra/entities/tenant.entity';
import { CreditorEntity } from '../person/creditor.entity';
import { EmitterEntity } from '../person/emitter.entity';
import { GuarantorEntity } from '../person/guarantor.entity';
import { ProductEntity } from '../product.entity';
import { FarmEntity } from '../person/farm.entity';

export class CprEntity extends TenantEntity {
  number: string;
  creditor: CreditorEntity;
  emitter: EmitterEntity;
  guarantor?: GuarantorEntity;
  product: ProductEntity;
  crop: string;
  quantity: number;
  productDevelopmentSite: FarmEntity;

  get sacas(): number {
    return this.quantity / 60;
  }

  get sacasFormatted(): string {
    return FormatterUtil.toNumberPTBR(this.sacas, 2);
  }

  get quantityFormatted(): string {
    return FormatterUtil.toNumberPTBR(this.quantity);
  }

  protected constructor() {
    super();

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

  static create(obj: Partial<CprEntity>): CprEntity {
    const {
      creditor,
      emitter,
      guarantor,
      product,
      crop,
      quantity,
      productDevelopmentSite,
    } = obj;
    return Object.assign(new CprEntity(), {
      creditor,
      emitter,
      guarantor,
      product,
      crop,
      quantity,
      productDevelopmentSite,
    });
  }
}
