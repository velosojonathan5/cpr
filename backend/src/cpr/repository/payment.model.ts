import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '../../infra/repository/typeORM/base.model';
import { CprModel } from './cpr.model';

@Entity('payment')
export class PaymentModel extends BaseModel {
  @Column({ name: 'number' })
  value: number;

  @Column({ name: 'due_date', type: 'json' })
  dueDate: Date;

  @ManyToOne(() => CprModel, (cpr) => cpr.paymentSchedule)
  cpr: CprModel;
}
