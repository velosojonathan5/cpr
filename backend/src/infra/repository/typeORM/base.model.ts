import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseModel {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  // TODO descomentar quando implementar multi-tenant
  //   @Column()
  //   tenantId: string;

  // TODO desmarcar opcional quando adicionar autenticação
  @Column({ name: 'created_by', nullable: true })
  createdBy?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy?: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
