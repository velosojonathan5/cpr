import { Readable } from 'node:stream';
import { CprDocument, SectionTemplate, Signatory } from '../cpr-document';
import { CprDocumentGenerator } from '../cpr-document-generator';
import * as PDFDocument from 'pdfkit';

export class PDFKitCprGenerator implements CprDocumentGenerator {
  generate(data: CprDocument): Readable {
    const { sections, signatories, headerImagePath } = data;

    const doc = new PDFDocument({ bufferPages: true });

    const stream: Readable = this.createReadableStream(doc);

    if (headerImagePath) {
      this.createHeaderImage(doc, headerImagePath);
    }

    this.createTitle(doc);

    this.createSections(doc, sections);

    this.createSignatories(doc, signatories);

    this.addPagination(doc);

    doc.info.Title = 'Cédula de Produto Rural';
    doc.info.Subject = 'CPR Digital';
    // TODO definir meta data na interface CprDocument para incluir metadata conforme usuario
    // doc.info.Author = 'Nome do usuário';

    doc.flushPages();

    doc.end();

    return stream;
  }

  private createReadableStream(doc: PDFKit.PDFDocument): Readable {
    const stream = new Readable({
      read() {},
    });

    doc.on('data', (chunk) => stream.push(chunk));
    doc.on('end', () => stream.push(null));
    doc.on('error', (err) => stream.destroy(err));
    return stream;
  }

  private createHeaderImage(doc: PDFKit.PDFDocument, headerImagePath: string) {
    const pageWidth = doc.page.width;
    doc.image(headerImagePath, 0, 0, {
      width: pageWidth,
      align: 'center',
    });
  }

  private createTitle(doc: PDFKit.PDFDocument) {
    doc.moveDown();
    doc.moveDown();

    doc.font('Helvetica-Bold');
    doc.fillColor('#468F5D');
    doc.fontSize(30).text('CÉDULA DE PRODUTO RURAL', { align: 'center' });
  }

  private createSections(doc: PDFKit.PDFDocument, sections: SectionTemplate[]) {
    sections.forEach(({ title, content }) => {
      if (!title && !content) return;

      doc
        .moveDown()
        .font('Helvetica-Bold')
        .fontSize(16)
        .fillColor('#468F5D')
        .rect(0, doc.y - 5, 50, 22)
        .fill('#468F5D')
        .text(title);

      doc.moveDown(0.5).font('Helvetica').fontSize(13);

      if (typeof content === 'string') {
        doc.fillColor('#000').text(content, { align: 'justify' });
      } else if (Array.isArray(content)) {
        content.forEach((subContent) => {
          doc.fillColor('#000').text(subContent, { align: 'justify' });
          doc.moveDown(0.5);
        });
      }
    });
  }

  private createSignatories(doc: PDFKit.PDFDocument, signatories: Signatory[]) {
    signatories.forEach((s) => {
      doc.moveDown(2);

      const posicaoX = 100;
      const posicaoY = doc.y;
      const larguraLinha = 200;
      const espessuraLinha = 1;

      // Adicionar a linha de assinatura
      doc
        .moveTo(posicaoX, posicaoY)
        .lineTo(posicaoX + larguraLinha, posicaoY)
        .lineWidth(espessuraLinha)
        .stroke();

      // Adicionar o nome do signatário abaixo da linha
      doc.fontSize(12).text(`${s.name} - ${s.role}`, posicaoX, posicaoY + 10);
    });
  }

  private addPagination(doc: PDFKit.PDFDocument) {
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);

      const bottomMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 0; // Remove margem inferior temporariamente

      doc.text(
        `Página ${i + 1} de ${pageCount}`,
        0,
        doc.page.height - bottomMargin / 2,
        { align: 'center' },
      );

      doc.page.margins.bottom = bottomMargin; // Restaura a margem inferior
    }
  }
}
