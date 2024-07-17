import { BaseEntity } from './base.entity';

export abstract class TenantEntity extends BaseEntity {
  public tenantId!: string;
}
