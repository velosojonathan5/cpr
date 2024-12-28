import { Repository } from 'typeorm';
import { TypeORMRepository } from './typeORM.repository';

describe('TypeORMRepository', () => {
  let repositoryMock: Repository<any>;
  let typeOrmRepository: TypeORMRepository<any>;

  beforeEach(() => {
    repositoryMock = {
      insert: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as Repository<any>;
    typeOrmRepository = new TypeORMRepository<any>(repositoryMock);
  });

  describe('find', () => {
    it('should call repository.find with the correct condition', async () => {
      const condition = { name: 'test' };
      repositoryMock.find = jest.fn().mockResolvedValue([]);

      await typeOrmRepository.find(condition);

      expect(repositoryMock.find).toHaveBeenCalledWith({ where: condition });
    });
  });

  describe('findPaginate', () => {
    it('should call repository.find with skip and take options', async () => {
      const condition = { name: 'test' };
      const skip = 5;
      const take = 10;
      repositoryMock.find = jest.fn().mockResolvedValue([]);

      await typeOrmRepository.findPaginate(condition, skip, take);

      expect(repositoryMock.find).toHaveBeenCalledWith({
        where: condition,
        skip,
        take,
      });
    });
  });

  describe('getById', () => {
    it('should call repository.findOne with the correct id', async () => {
      const id = '123';

      repositoryMock.findOne = jest.fn().mockResolvedValue(undefined);

      await typeOrmRepository.getById(id);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('insert', () => {
    it('should call repository.save with the correct entity', async () => {
      const entity = { id: '123', name: 'test' };
      repositoryMock.save = jest.fn().mockResolvedValue(entity);

      const result = await typeOrmRepository.insert(entity);

      expect(repositoryMock.save).toHaveBeenCalledWith(entity);
      expect(result).toEqual(entity);
    });
  });

  describe('update', () => {
    it('should call repository.update with the correct id and entity', async () => {
      const entity = { name: 'updated' };
      const id = '123';
      repositoryMock.update = jest
        .fn()
        .mockResolvedValue({ affected: 1 } as any);

      const result = await typeOrmRepository.update(entity, id);

      expect(repositoryMock.update).toHaveBeenCalledWith(id, entity);
      expect(result).toBe(1);
    });

    it('should return 0 if no rows are affected', async () => {
      repositoryMock.update = jest
        .fn()
        .mockResolvedValue({ affected: 0 } as any);

      const result = await typeOrmRepository.update({}, '123');

      expect(result).toBe(0);
    });
  });

  describe('updateMany', () => {
    it('should call repository.update with the correct condition and entity', async () => {
      const entity = { name: 'updated' };
      const condition = { active: true };
      repositoryMock.update = jest
        .fn()
        .mockResolvedValue({ affected: 2 } as any);

      const result = await typeOrmRepository.updateMany(entity, condition);

      expect(repositoryMock.update).toHaveBeenCalledWith(condition, entity);
      expect(result).toBe(2);
    });
  });

  describe('remove', () => {
    it('should call repository.find and repository.remove with the correct condition', async () => {
      const condition = { active: false };
      const entities = [{ id: '1' }, { id: '2' }];
      repositoryMock.find = jest.fn().mockResolvedValue(entities);
      repositoryMock.remove = jest.fn().mockResolvedValue(entities);

      await typeOrmRepository.remove(condition);

      expect(repositoryMock.find).toHaveBeenCalledWith({ where: condition });
      expect(repositoryMock.remove).toHaveBeenCalledWith(entities);
    });

    it('should not call repository.remove if no entities are found', async () => {
      repositoryMock.find = jest.fn().mockResolvedValue([]);

      await typeOrmRepository.remove({ active: false });

      expect(repositoryMock.find).toHaveBeenCalled();
      expect(repositoryMock.remove).not.toHaveBeenCalled();
    });
  });
});
