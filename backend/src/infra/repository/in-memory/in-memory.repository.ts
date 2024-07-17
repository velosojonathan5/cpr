import { CRUDRepository } from '../crud.repository';

export class InMemoryRepository<T extends { id?: string }>
  implements CRUDRepository<T>
{
  private data: T[] = [];
  private nextId: number = 1;

  find(condition?: Record<string, unknown>): Promise<T[]> {
    if (!condition) {
      return Promise.resolve(this.data);
    }
    const keys = Object.keys(condition);
    const result = this.data.filter((item) =>
      keys.every((key) => item[key] === condition[key]),
    );
    return Promise.resolve(result);
  }

  findPaginate(
    condition?: Record<string, unknown>,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<T[]> {
    return this.find(condition).then((results) => {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return results.slice(start, end);
    });
  }

  getById(id: string): Promise<T | undefined> {
    const result = this.data.find((item) => item.id === id);
    return Promise.resolve(result);
  }

  insert(entity: T): Promise<T> {
    this.data.push(entity);
    return Promise.resolve(entity);
  }

  update(entity: T, id: string): Promise<number> {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === -1) {
      return Promise.resolve(0);
    }
    this.data[index] = { ...this.data[index], ...entity };
    return Promise.resolve(1);
  }

  updateMany(entity: T, condition: Record<string, unknown>): Promise<number> {
    const keys = Object.keys(condition);
    let count = 0;
    this.data = this.data.map((item) => {
      if (keys.every((key) => item[key] === condition[key])) {
        count++;
        return { ...item, ...entity };
      }
      return item;
    });
    return Promise.resolve(count);
  }

  remove(condition: Record<string, unknown>): Promise<void> {
    const keys = Object.keys(condition);
    this.data = this.data.filter(
      (item) => !keys.every((key) => item[key] === condition[key]),
    );
    return Promise.resolve();
  }
}
