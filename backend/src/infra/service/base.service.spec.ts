import { NotFoundException } from '@nestjs/common';
import { BaseEntity } from '../entities/base.entity';
import { CRUDRepository } from '../repository/crud.repository';
import { BaseService } from './base.service';

class TestEntity extends BaseEntity {
  id: string;
  name: string;
}

describe('BaseService', () => {
  let service: BaseService<TestEntity>;
  let repository: CRUDRepository<TestEntity>;

  beforeEach(() => {
    repository = {
      find: jest.fn(),
      getById: jest.fn(),
      insert: jest.fn(),
    } as any;

    service = new BaseService(repository);
  });

  it('should call repository.find with correct conditions', async () => {
    const conditions = { name: 'test' };
    await service['find'](conditions);
    expect(repository.find).toHaveBeenCalledWith(conditions);
  });

  it('should call repository.getById and return the item if found', async () => {
    const testId = '1';
    const testEntity = { id: '1', name: 'test' } as TestEntity;
    (repository.getById as jest.Mock).mockResolvedValue(testEntity);

    const result = await service.getById(testId);
    expect(result).toBe(testEntity);
  });

  it('should throw NotFoundException if item is not found', async () => {
    const testId = '1';
    (repository.getById as jest.Mock).mockResolvedValue(null);

    await expect(service.getById(testId)).rejects.toThrow(NotFoundException);
  });

  it('should call preSave, insert, and postSave when saving an entity', async () => {
    const testEntity = { id: '1', name: 'test' } as TestEntity;
    const savedEntity = { id: '1', name: 'test-saved' } as TestEntity;
    (repository.insert as jest.Mock).mockResolvedValue(savedEntity);

    const preSaveSpy = jest.spyOn(service as any, 'preSave');
    const postSaveSpy = jest.spyOn(service as any, 'postSave');

    const result = await service.save(testEntity);

    expect(preSaveSpy).toHaveBeenCalledWith(testEntity);
    expect(repository.insert).toHaveBeenCalledWith(testEntity);
    expect(postSaveSpy).toHaveBeenCalledWith(testEntity, savedEntity);
    expect(result).toBe(savedEntity);
  });
});
