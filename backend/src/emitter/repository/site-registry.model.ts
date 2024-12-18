import { Entity } from 'typeorm';
import { RegistryModel } from './registry.model';

@Entity('site_registry')
export class SiteRegistryModel extends RegistryModel {}
