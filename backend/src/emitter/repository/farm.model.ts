import { PossessionEnum } from '../../entities/person/farm.entity';
import { BaseModel } from '../../infra/repository/typeORM/base.model';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AddressModel } from '../../infra/repository/typeORM/address.model';
import { SiteRegistryModel } from './site-registry.model';
import { RentRegistryModel } from './rent-registry.model';
import { EmitterModel } from './emitter.model';

@Entity('farm')
export class FarmModel extends BaseModel {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'inscricao_estadual' })
  inscricaoEstadual: string;

  @OneToOne(() => AddressModel)
  @JoinColumn()
  address: AddressModel;

  @Column({ name: 'tatal_area' })
  tatalArea: number;

  @Column({ name: 'cultivated_area' })
  cultivatedArea: number;

  @Column({ name: 'nirf' })
  nirf: string;

  @Column({ name: 'possession', type: 'enum', enum: PossessionEnum })
  possession: PossessionEnum;

  @OneToOne(() => SiteRegistryModel)
  @JoinColumn()
  siteRegistry?: SiteRegistryModel;

  @OneToOne(() => RentRegistryModel)
  @JoinColumn()
  rentRegistry?: RentRegistryModel;

  @ManyToOne(() => EmitterModel, (emitter) => emitter.developmentSites)
  emitter: EmitterModel;
}
