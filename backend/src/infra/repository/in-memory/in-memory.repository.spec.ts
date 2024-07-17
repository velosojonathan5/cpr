import { InMemoryRepository } from './in-memory.repository';

interface TestEntity {
  id?: string;
  name: string;
  age: number;
}

describe('InMemoryRepository', () => {
  let repository: InMemoryRepository<TestEntity>;

  beforeEach(() => {
    repository = new InMemoryRepository<TestEntity>();
  });

  test('should insert a new entity', async () => {
    const entity = { id: '1', name: 'John Doe', age: 30 };
    const inserted = await repository.insert(entity);
    expect(inserted.id).toBeDefined();
    expect(inserted.name).toBe('John Doe');
    expect(inserted.age).toBe(30);
  });

  test('should find entities by condition', async () => {
    await repository.insert({ name: 'John Doe', age: 30 });
    await repository.insert({ name: 'Jane Doe', age: 25 });
    const results = await repository.find({ age: 30 });
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('John Doe');
  });

  test('should paginate results', async () => {
    for (let i = 0; i < 20; i++) {
      await repository.insert({ name: `User ${i}`, age: i });
    }
    const results = await repository.findPaginate({}, 2, 5);
    expect(results).toHaveLength(5);
    expect(results[0].name).toBe('User 5');
  });

  test('should get entity by id', async () => {
    const entity = await repository.insert({ name: 'John Doe', age: 30 });
    const found = await repository.getById(entity.id!);
    expect(found).toBeDefined();
    expect(found!.name).toBe('John Doe');
  });

  test('should update an entity by id', async () => {
    const entity = await repository.insert({ name: 'John Doe', age: 30 });
    const updateCount = await repository.update(
      { name: 'John Smith' } as unknown as TestEntity,
      entity.id!,
    );
    expect(updateCount).toBe(1);
    const updated = await repository.getById(entity.id!);
    expect(updated!.name).toBe('John Smith');
  });

  test('should update multiple entities', async () => {
    await repository.insert({ name: 'John Doe', age: 30 });
    await repository.insert({ name: 'Jane Doe', age: 30 });
    const updateCount = await repository.updateMany(
      { age: 31 } as unknown as TestEntity,
      { age: 30 },
    );
    expect(updateCount).toBe(2);
    const results = await repository.find({ age: 31 });
    expect(results).toHaveLength(2);
  });

  test('should remove entities by condition', async () => {
    await repository.insert({ name: 'John Doe', age: 30 });
    await repository.insert({ name: 'Jane Doe', age: 25 });
    await repository.remove({ age: 30 });
    const results = await repository.find();
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Jane Doe');
  });
});
