import { CprEntity } from 'src/entities/cpr/cpr.entity';
import { CprDocumentGenerator } from './cpr-document-generator';
import { Readable } from 'node:stream';
import { PMGCprDataModel } from './pmg-cpr-data-model/pmg-cpr-data-model';

export class CprDocumentFactory {
  constructor(private cprDocumentGenerator: CprDocumentGenerator) {}

  generateDocument(cpr: CprEntity): Readable {
    // se precisa implementar uma regra pra um cliente especifico

    // caso não entre nas situações anteriores
    const defaltDocument = new PMGCprDataModel();
    const data = defaltDocument.generateData(cpr);

    return this.cprDocumentGenerator.generate(data);
  }
}
