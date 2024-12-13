import { CreditorEntity } from '../../entities/person/creditor.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseModel } from '../../infra/repository/typeORM/base.model';
import { EmitterEntity } from '../../entities/person/emitter.entity';
import { GuarantorEntity } from '../../entities/person/guarantor.entity';
import { ProductEntity } from '../../entities/product.entity';
import { FarmEntity } from '../../entities/person/farm.entity';
import { CompanyEntity } from '../../entities/person/company.entity';
import { ResponsibleForExpensesEnum } from '../../entities/cpr/cpr.entity';
import { PaymentModel } from './payment.model';

@Entity('cpr')
export class CprModel extends BaseModel {
  @Column({ name: 'number' })
  number: string;

  @Column({ type: 'json' })
  creditor: CreditorEntity;

  @Column({ name: 'emitter', type: 'json' })
  emitter: EmitterEntity;

  @Column({ name: 'guarantor', type: 'json' })
  guarantor?: GuarantorEntity;

  @Column({ name: 'product', type: 'json' })
  product: ProductEntity;

  @Column({ name: 'crop' })
  crop: string;

  @Column({ name: 'quantity' })
  quantity: number;

  @Column({ name: 'product_development_site', type: 'json' })
  productDevelopmentSite: FarmEntity;

  @OneToMany(() => PaymentModel, (payment) => payment.cpr, { cascade: true })
  paymentSchedule: PaymentModel[];

  @Column({ name: 'delivery_place', type: 'json' })
  deliveryPlace: CompanyEntity;

  @Column({ name: 'issue_date' })
  issueDate: Date;

  @Column({
    name: 'responsible_for_expenses',
    type: 'enum',
    enum: ResponsibleForExpensesEnum,
  })
  responsibleForExpenses: ResponsibleForExpensesEnum;
}
