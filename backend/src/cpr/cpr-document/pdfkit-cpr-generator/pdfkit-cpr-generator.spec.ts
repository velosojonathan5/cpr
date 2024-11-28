import { Readable } from 'node:stream';
import { PDFKitCprGenerator } from './pdfkit-cpr-generator';
import { CprDocument, SectionTemplate, Signatory } from '../cpr-document';
import * as PDFDocument from 'pdfkit';
import { PDFExtract } from 'pdf.js-extract';
const pdfExtract = new PDFExtract();

function streamToBuffer(readable: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    readable.on('data', (chunk) => chunks.push(chunk));
    readable.on('end', () => resolve(Buffer.concat(chunks)));
    readable.on('error', reject);
  });
}

async function extractPdfContent(buffer: Buffer): Promise<string> {
  return JSON.stringify((await pdfExtract.extractBuffer(buffer)).pages);
}

describe('PDFKitCprGenerator', () => {
  let generator: PDFKitCprGenerator;

  beforeEach(() => {
    generator = new PDFKitCprGenerator();
  });

  it('should generate a PDF stream', async () => {
    const data: CprDocument = {
      sections: [],
      signatories: [],
      headerImagePath: null,
    };

    const stream = generator.generate(data);
    expect(stream).toBeInstanceOf(Readable);

    const buffer = await streamToBuffer(stream);
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('should include header image if path is provided', async () => {
    const data: CprDocument = {
      sections: [],
      signatories: [],
      headerImagePath: './path/to/header.png',
    };

    const mockImage = jest
      .spyOn(PDFDocument.prototype, 'image')
      .mockImplementation(() => PDFDocument.prototype);

    const stream = generator.generate(data);

    // Consume o stream para garantir que o método `image` é chamado
    await streamToBuffer(stream);

    expect(mockImage).toHaveBeenCalledWith(
      './path/to/header.png',
      0,
      0,
      expect.objectContaining({ width: expect.any(Number), align: 'center' }),
    );

    mockImage.mockRestore();
  });

  it('should add sections to the document', async () => {
    const sections: SectionTemplate[] = [
      { title: 'Section 1', content: 'Content of Section 1' },
      { title: 'Section 2', content: ['Content 1', 'Content 2'] },
    ];
    const data: CprDocument = {
      sections,
      signatories: [],
      headerImagePath: null,
    };

    const stream = generator.generate(data);

    const buffer = await streamToBuffer(stream);

    const pdfContent = await extractPdfContent(buffer);

    expect(pdfContent).toContain('Section 1');
    expect(pdfContent).toContain('Content of Section 1');
    expect(pdfContent).toContain('Section 2');
    expect(pdfContent).toContain('Content 1');
    expect(pdfContent).toContain('Content 2');
  });

  it('should add signatories to the document', async () => {
    const signatories: Signatory[] = [
      {
        name: 'John Doe',
        role: 'Signer',
        email: '',
      },
      {
        name: 'Jane Smith',
        role: 'Witness',
        email: '',
      },
    ];
    const data: CprDocument = {
      sections: [],
      signatories,
      headerImagePath: null,
    };

    const stream = generator.generate(data);

    const buffer = await streamToBuffer(stream);
    const pdfContent = await extractPdfContent(buffer);

    expect(pdfContent).toContain('John Doe');
    expect(pdfContent).toContain('Signer');
    expect(pdfContent).toContain('Jane Smith');
    expect(pdfContent).toContain('Witness');
  });

  it('should add pagination to the document', async () => {
    const sections: SectionTemplate[] = Array(10)
      .fill(null)
      .map((_, index) => ({
        title: `Section ${index + 1}`,
        content: `Content for section ${index + 1}`,
      }));

    const data: CprDocument = {
      sections,
      signatories: [],
      headerImagePath: null,
    };

    const stream = generator.generate(data);

    const buffer = await streamToBuffer(stream);
    const pdfContent = await extractPdfContent(buffer);

    expect(pdfContent).toContain('Página 1 de');
    expect(pdfContent).toContain('Página 2 de');
  });
});
