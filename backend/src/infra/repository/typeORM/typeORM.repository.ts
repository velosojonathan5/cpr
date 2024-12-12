import { Repository, FindOptionsWhere } from 'typeorm';
import { CRUDRepository } from '../crud.repository';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class TypeORMRepository<T> implements CRUDRepository<T> {
  constructor(private readonly repository: Repository<T>) {}

  async find(condition?: Record<string, unknown>): Promise<T[]> {
    return this.repository.find({ where: condition as FindOptionsWhere<T> });
  }

  async findPaginate(
    condition?: Record<string, unknown>,
    skip = 0,
    take = 10,
  ): Promise<T[]> {
    return this.repository.find({
      where: condition as FindOptionsWhere<T>,
      skip,
      take,
    });
  }

  async getById(id: string): Promise<T | undefined> {
    return this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
    });
  }

  async insert(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  async update(entity: T, id: string): Promise<number> {
    const result = await this.repository.update(
      id,
      entity as QueryDeepPartialEntity<T>,
    );
    return result.affected || 0;
  }

  async updateMany(
    entity: T,
    condition: Record<string, unknown>,
  ): Promise<number> {
    const result = await this.repository.update(
      condition as FindOptionsWhere<T>,
      entity as QueryDeepPartialEntity<T>,
    );
    return result.affected || 0;
  }

  async remove(condition: Record<string, unknown>): Promise<void> {
    const entities = await this.repository.find({
      where: condition as FindOptionsWhere<T>,
    });
    if (entities.length > 0) {
      await this.repository.remove(entities);
    }
  }
}
