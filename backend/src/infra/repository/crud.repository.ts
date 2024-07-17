export interface CRUDRepository<T> {
  find(condition?: Record<string, unknown>): Promise<T[]>;
  findPaginate(condition?: Record<string, unknown>): Promise<T[]>;
  getById(id: string): Promise<T | undefined>;
  insert(entity: T): Promise<T>;
  update(entity: T, id: string): Promise<number>;
  updateMany(entity: T, condition: Record<string, unknown>): Promise<number>;
  remove(condition: Record<string, unknown>): Promise<void>;
}
