import { BaseEntity } from '../../infra/entities/base.entity';

export enum UserStatusEnum {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

export class UserEntity extends BaseEntity {
  name: string;
  email: string;
  password: string;
  status: UserStatusEnum;

  private constructor() {
    super();
  }

  static create(obj: {
    name: string;
    email: string;
    password: string;
  }): UserEntity {
    const { name, email, password } = obj;
    const user = Object.assign(new UserEntity(), { name, email, password });
    user.status = UserStatusEnum.DISABLED;

    return user;
  }
}
