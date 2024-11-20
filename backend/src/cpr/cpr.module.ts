import { Module } from '@nestjs/common';
import { CprService } from './cpr.service';
import { CprController } from './cpr.controller';
import { CprPhysicController } from './cpr-physic/cpr-physic.controller';
import { CprPhysicService } from './cpr-physic/cpr-physic.service';
import { CreditorModule } from '../creditor/creditor.module';
import { InMemoryRepository } from '../infra/repository/in-memory/in-memory.repository';
import { CprEntity } from '../entities/cpr/cpr.entity';
import { EmitterModule } from '../emitter/emitter.module';
import { DeliveryPlaceModule } from '../delivery-place/delivery-place.module';
import { CprPhysicEntity } from 'src/entities/cpr/cpr-physic.entity';

export type SectionTemplate = {
  titleFn?: (cpr: CprPhysicEntity) => string;
  contentFn?: (cpr: CprPhysicEntity) => string | string[];
  title?: string;
  content?: string | string[];
};

export type Section = {
  title: string;
  content: string | string[];
};

export type Signatory = { role: string; name: string; email: string };

class DefaultCprDataModel {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  generateData(cpr: CprPhysicEntity): CprDocumentData {
    // implementar aqui logica que gera os dados do documento com as sessões
    return {} as unknown as CprDocumentData;
  }
}

interface CprDocumentData {
  sections: SectionTemplate[];
  signatures: Signatory[];
}
interface ICprDocumentFactory {
  generateDocument(cpr: CprPhysicEntity): ReadableStream;
}

interface CprPdfGenerator {
  generate(data: CprDocumentData): ReadableStream;
}

interface Context {
  getTenant(): string;
}

class CprDocumentFactory implements ICprDocumentFactory {
  constructor(
    private cprPdfGenerator: CprPdfGenerator,
    private context: Context,
  ) {}

  generateDocument(cpr: CprPhysicEntity): ReadableStream {
    let data: CprDocumentData;

    // se precisa implementar uma regra pra um cliente especifico
    if (this.context.getTenant() === 'CLIENTE_ESPECIFICO') {
      // busca aqui o modelo especifico de dados
    } else {
      // caso não entre nas situações anteriores
      const defaltDocument = new DefaultCprDataModel();
      data = defaltDocument.generateData(cpr);
    }

    return this.cprPdfGenerator.generate(data);
  }
}

@Module({
  controllers: [CprController, CprPhysicController],
  providers: [
    CprService,
    CprPhysicService,
    {
      provide: 'KEY_REPOSITORY_CPR',
      useValue: new InMemoryRepository<CprEntity>(),
    },
    {
      provide: 'CPR_DOCUMENT_FACTORY',
      useValue: new CprDocumentFactory(
        {} as unknown as CprPdfGenerator,
        {} as unknown as Context,
      ),
    },
  ],
  imports: [CreditorModule, EmitterModule, DeliveryPlaceModule],
})
export class CprModule {}
