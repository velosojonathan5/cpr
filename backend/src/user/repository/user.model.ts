import { UserStatusEnum } from '../../entities/person/user.entity';
import { BaseModel } from '../../infra/repository/typeORM/base.model';
import { Column, Entity } from 'typeorm';

@Entity('user')
export class UserModel extends BaseModel {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'status' })
  status: UserStatusEnum;
}
