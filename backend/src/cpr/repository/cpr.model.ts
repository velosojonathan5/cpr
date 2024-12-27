import { CreditorEntity } from '../../entities/person/creditor.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from '../../infra/repository/typeORM/base.model';
import { GuarantorEntity } from '../../entities/person/guarantor.entity';
import { ProductEntity } from '../../entities/product.entity';
import { CompanyEntity } from '../../entities/person/company.entity';
import { ResponsibleForExpensesEnum } from '../../entities/cpr/cpr.entity';
import { PaymentModel } from './payment.model';
import { CreditorModel } from '../../creditor/repository/creditor.model';
import { EmitterModel } from '../../emitter/repository/emitter.model';
import { FarmModel } from '../../emitter/repository/farm.model';
import { FarmEntity } from '../../entities/person/farm.entity';
import { DeliveryPlaceModel } from '../../delivery-place/repository/delivery-place.model';

@Entity('cpr')
export class CprModel extends BaseModel {
  @Column({ name: 'number' })
  number: string;

  @Column({ name: 'creditor_details', type: 'json' })
  creditorDetails: Partial<CreditorEntity>;

  @Column({ name: 'emitter_details', type: 'json' })
  emitterDetails: Partial<CreditorEntity>;

  @Column({ name: 'guarantor', type: 'json' })
  guarantor?: GuarantorEntity;

  @Column({ name: 'product', type: 'json' })
  product: ProductEntity;

  @Column({ name: 'crop' })
  crop: string;

  @Column({ name: 'quantity' })
  quantity: number;

  @Column({ name: 'product_development_site_details', type: 'json' })
  productDevelopmentSiteDetails: FarmEntity;

  @Column({ name: 'delivery_place_details', type: 'json' })
  deliveryPlaceDetails: CompanyEntity;

  @Column({ name: 'issue_date' })
  issueDate: Date;

  @Column({
    name: 'responsible_for_expenses',
    type: 'enum',
    enum: ResponsibleForExpensesEnum,
  })
  responsibleForExpenses: ResponsibleForExpensesEnum;

  @OneToMany(() => PaymentModel, (payment) => payment.cpr, { cascade: true })
  paymentSchedule: PaymentModel[];

  @ManyToOne(() => CreditorModel, (creditor) => creditor.cprs)
  creditor: CreditorModel;

  @ManyToOne(() => EmitterModel, (emitter) => emitter.cprs)
  emitter: EmitterModel;

  @ManyToOne(() => FarmModel, (farm) => farm.cprs)
  productDevelopmentSite: FarmModel;

  @ManyToOne(() => DeliveryPlaceModel, (deliveryPlace) => deliveryPlace.cprs)
  deliveryPlace: DeliveryPlaceModel;
}
