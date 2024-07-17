import { v7 as uuidv7 } from 'uuid';

export abstract class BaseEntity {
  public id!: string;
  public createdBy!: string;
  public createdAt!: Date;
  public updatedBy!: string | null;
  public updatedAt!: Date | null;

  constructor(id?: string) {
    this.id = id || uuidv7();
  }
}
