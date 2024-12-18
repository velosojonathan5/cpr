import { Column, Entity } from 'typeorm';
import { RegistryModel } from './registry.model';

// TODO validar se essa lógica de herança realmente faz sentido, acho que essa model não é necessária
@Entity('rent_registry')
export class RentRegistryModel extends RegistryModel {
  @Column({ name: 'initial_date' })
  initialDate: Date;

  @Column({ name: 'final_date' })
  finalDate: Date;
}
