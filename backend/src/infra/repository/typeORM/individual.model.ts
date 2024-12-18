import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import {
  GenderEnum,
  MaritalStatusEnum,
  MatrimonialRegimeEnum,
} from '../../../entities/person/individual.entity';
import { PersonModel } from './person.model';
import { SpouseModel } from './spouse.model';

@Entity('individual')
export class IndividualModel extends PersonModel {
  @Column({ name: 'cpf' })
  cpf: string;

  @Column({ name: 'gender' })
  gender?: GenderEnum;

  @Column({ name: 'rg_number', nullable: true })
  rgNumber?: string;

  @Column({ name: 'rg_emited_by', nullable: true })
  rgEmitedBy?: string;

  @Column({ name: 'rg_emited_date', nullable: true })
  rgEmitedDate?: Date;

  @Column({
    name: 'marital_status',
    type: 'enum',
    enum: MaritalStatusEnum,
    nullable: true,
  })
  maritalStatus?: MaritalStatusEnum;

  @Column({
    name: 'matrimonial_regime',
    type: 'enum',
    enum: MatrimonialRegimeEnum,
    nullable: true,
  })
  matrimonialRegime?: MatrimonialRegimeEnum;

  @OneToOne(() => SpouseModel)
  @JoinColumn()
  spouse?: SpouseModel;

  @Column({ name: 'profession', nullable: true })
  profession?: string;
}
