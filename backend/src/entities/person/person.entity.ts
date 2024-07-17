import { TenantEntity } from '../../infra/entities/tenant.entity';
import { AddressEntity } from './address.entity';

export abstract class PersonEntity extends TenantEntity {
  name: string;
  phone: string;
  email: string;
  address?: AddressEntity;

  protected constructor(id?: string) {
    super(id);
  }

  get qualification(): string {
    return `${this.name}`;
  }
}
