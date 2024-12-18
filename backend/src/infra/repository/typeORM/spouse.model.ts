import { Column, Entity, OneToOne } from 'typeorm';
import { IndividualModel } from './individual.model';
import { PersonModel } from './person.model';

@Entity('spouse')
export class SpouseModel extends PersonModel {
  @Column({ name: 'cpf' })
  cpf: string;

  @Column({ name: 'rg_number' })
  rgNumber?: string;

  @Column({ name: 'rg_emited_by' })
  rgEmitedBy?: string;

  @Column({ name: 'rg_emited_date' })
  rgEmitedDate?: Date;

  @OneToOne(() => IndividualModel)
  individual?: IndividualModel;
}
