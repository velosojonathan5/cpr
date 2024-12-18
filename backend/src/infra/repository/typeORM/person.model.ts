import { Column, JoinColumn, OneToOne } from 'typeorm';
import { BaseModel } from './base.model';
import { AddressModel } from './address.model';

export class PersonModel extends BaseModel {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'phone', nullable: true })
  phone?: string;

  @Column({ name: 'email', nullable: true })
  email?: string;

  @OneToOne(() => AddressModel)
  @JoinColumn()
  address?: AddressModel;
}
