import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { RegistryModel } from './registry.model';
import { AddressModel } from '../../infra/repository/typeORM/address.model';
import { BaseModel } from '../../infra/repository/typeORM/base.model';
import { TypeOfPossessionEnum } from '../../entities/person/farm.entity';

// TODO validar se essa lógica de herança realmente faz sentido, acho que essa model não é necessária
@Entity('rent_registry')
export class RentRegistryModel extends BaseModel implements RegistryModel {
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

  @Column({
    name: 'type_of_possession_enum',
    nullable: true,
    type: 'enum',
    enum: TypeOfPossessionEnum,
  })
  typeOfPossessionEnum?: TypeOfPossessionEnum;

  @Column({ name: 'initial_date' })
  initialDate: Date;

  @Column({ name: 'final_date' })
  finalDate: Date;
}
