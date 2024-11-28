import { Module } from '@nestjs/common';
import { CprService } from './cpr.service';
import { CprController } from './cpr.controller';
import { CreditorModule } from '../creditor/creditor.module';
import { InMemoryRepository } from '../infra/repository/in-memory/in-memory.repository';
import { CprEntity } from '../entities/cpr/cpr.entity';
import { EmitterModule } from '../emitter/emitter.module';
import { DeliveryPlaceModule } from '../delivery-place/delivery-place.module';
import { PDFKitCprGenerator } from './cpr-document/pdfkit-cpr-generator/pdfkit-cpr-generator';
import { CprDocumentFactory } from './cpr-document/cpr-document-factory';
import { S3FileManagerClient } from 'src/file-manager-client/S3-file-manager-client/S3-file-manager-client';

@Module({
  controllers: [CprController],
  providers: [
    CprService,
    {
      provide: 'KEY_REPOSITORY_CPR',
      useValue: new InMemoryRepository<CprEntity>(),
    },
    {
      provide: 'CPR_DOCUMENT_FACTORY',
      useValue: new CprDocumentFactory(new PDFKitCprGenerator()),
    },
    {
      provide: 'FILE_MANAGER_CLIENT',
      useClass: S3FileManagerClient,
    },
  ],
  imports: [CreditorModule, EmitterModule, DeliveryPlaceModule],
})
export class CprModule {}
