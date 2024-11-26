import { PDFKitCprGenerator } from './pdfkit-cpr-generator'; // Ajuste o caminho conforme necessário
import { CprDocument } from '../cpr-document';
import { Readable } from 'node:stream';

describe('PDFKitCprGenerator', () => {
  let generator: PDFKitCprGenerator;

  beforeEach(() => {
    generator = new PDFKitCprGenerator();
  });

  it('deve retornar um Readable Stream', () => {
    const data: CprDocument = {
      sections: [],
      signatories: [],
      headerImagePath: undefined,
    };

    const stream = generator.generate(data);
    expect(stream).toBeInstanceOf(Readable);
  });
});
