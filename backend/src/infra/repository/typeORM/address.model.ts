import { CreditorModel } from '../../../creditor/repository/creditor.model';
import { BaseModel } from './base.model';
import { StateEnum } from '../../../infra/entities/state-enum';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity('address')
export class AddressModel extends BaseModel {
  @Column({ name: 'postal_code' })
  postalCode: string;

  @Column({ name: 'city' })
  city: string;

  @Column({ name: 'state' })
  state: StateEnum;

  @Column({ name: 'public_area' })
  publicArea: string;

  @Column({ name: 'number', nullable: true })
  number?: string;

  @Column({ name: 'complement', nullable: true })
  complement?: string;

  @Column({ name: 'district' })
  district: string;

  @Column({ name: 'mailbox', nullable: true })
  mailbox?: string;

  @OneToOne(() => CreditorModel)
  creditor?: CreditorModel;
}
