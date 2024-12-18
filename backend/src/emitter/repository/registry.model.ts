import { BaseModel } from '../../infra/repository/typeORM/base.model';
import { TypeOfPossessionEnum } from '../../entities/person/farm.entity';
import { AddressModel } from '../../infra/repository/typeORM/address.model';
import { Column, JoinColumn, OneToOne } from 'typeorm';

export class RegistryModel extends BaseModel {
  @Column({ name: 'number' })
  number: string;

  @Column({ name: 'regitry_place_name' })
  regitryPlaceName?: string;

  @OneToOne(() => AddressModel)
  @JoinColumn()
  address?: AddressModel;

  @Column({ name: 'book', nullable: true })
  book?: string;

  @Column({ name: 'sheet', nullable: true })
  sheet?: string;

  @Column({ name: 'regitry_date', nullable: true })
  regitryDate?: Date;

  @Column({ name: 'type_of_possession_enum', nullable: true })
  typeOfPossessionEnum?: TypeOfPossessionEnum;
}
