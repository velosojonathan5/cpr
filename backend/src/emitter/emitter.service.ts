import { Inject, Injectable } from '@nestjs/common';
// import { CreateEmitterDto } from './dto/create-emitter.dto';
// import { UpdateEmitterDto } from './dto/update-emitter.dto';
import { EmitterEntity } from '../entities/person/emitter.entity';
import { BaseService } from '../infra/service/base.service';
import { CRUDRepository } from '../infra/repository/crud.repository';

@Injectable()
export class EmitterService extends BaseService<EmitterEntity> {
  constructor(
    @Inject('KEY_REPOSITORY_EMITTER')
    private readonly emitterRepository: CRUDRepository<EmitterEntity>,
  ) {
    super(emitterRepository);
  }

  // create(createEmitterDto: CreateEmitterDto) {
  //   return 'This action adds a new emitter';
  // }

  // findAll() {
  //   return `This action returns all emitter`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} emitter`;
  // }

  // update(id: number, updateEmitterDto: UpdateEmitterDto) {
  //   return `This action updates a #${id} emitter`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} emitter`;
  // }
}
