import { Injectable } from '@nestjs/common';
import { TypeORMRepository } from '../../infra/repository/typeORM/typeORM.repository';
import { UserEntity } from '../../entities/person/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './user.model';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository extends TypeORMRepository<UserEntity> {
  constructor(
    @InjectRepository(UserModel)
    private emitterRepository: Repository<UserModel>,
  ) {
    super(emitterRepository);
  }
}
