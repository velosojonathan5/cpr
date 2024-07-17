import { Module } from '@nestjs/common';
import { CprService } from './cpr.service';
import { CprController } from './cpr.controller';
import { CprPhysicController } from './cpr-physic/cpr-physic.controller';
import { CprPhysicService } from './cpr-physic/cpr-physic.service';
import { CreditorModule } from '../creditor/creditor.module';
import { InMemoryRepository } from '../infra/repository/in-memory/in-memory.repository';
import { CprEntity } from '../entities/cpr/cpr.entity';
import { EmitterModule } from 'src/emitter/emitter.module';

@Module({
  controllers: [CprController, CprPhysicController],
  providers: [
    CprService,
    CprPhysicService,
    {
      provide: 'KEY_REPOSITORY_CPR',
      useValue: new InMemoryRepository<CprEntity>(),
    },
  ],
  imports: [CreditorModule, EmitterModule],
})
export class CprModule {}
