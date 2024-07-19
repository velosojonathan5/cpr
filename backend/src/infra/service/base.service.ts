import { NotFoundException } from '@nestjs/common';
import { BaseEntity } from '../entities/base.entity';
import { CRUDRepository } from '../repository/crud.repository';

export class BaseService<T extends BaseEntity> {
  constructor(private readonly repository: CRUDRepository<T>) {}

  protected find(condition?: Record<string, unknown>): Promise<T[]> {
    return this.repository.find(condition);
  }

  async getById(id: string): Promise<T> {
    const item = await this.repository.getById(id);

    if (!item) {
      throw new NotFoundException(id);
    }

    return item;
  }

  async save(entity: T): Promise<T> {
    this.preSave(entity);
    const item = await this.repository.insert(entity);
    this.postSave(entity, item);
    return item;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  preSave<T extends BaseEntity>(entity: T): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  postSave<T extends BaseEntity>(entity: T, item: T): void {}
}
