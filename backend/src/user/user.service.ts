import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { CRUDRepository } from '../infra/repository/crud.repository';
import { UserEntity } from '../entities/person/user.entity';
import { BaseService } from 'src/infra/service/base.service';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @Inject('KEY_REPOSITORY_USER')
    private readonly userRepository: CRUDRepository<UserEntity>,
  ) {
    super(userRepository);
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    return (await this.userRepository.find({ email }))[0];
  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async compareHashPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = UserEntity.create({
      ...createUserDto,
      password: await this.hashPassword(createUserDto.password),
    });

    await this.save(user);

    user.password = undefined;
    return user;
  }
}
