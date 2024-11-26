import { Readable } from 'node:stream';
import { CprDocument } from '../cpr-document';
import { CprDocumentGenerator } from '../cpr-document-generator';
import * as PDFDocument from 'pdfkit';

export class PDFKitCprGenerator implements CprDocumentGenerator {
  generate(data: CprDocument): Readable {
    const { sections, signatories, headerImagePath } = data;

    const doc = new PDFDocument({ bufferPages: true });

    // PARTE DE CRIAR O READABLE STREAM
    // --------------------------------
    const stream = new Readable({
      read() {},
    });

    doc.on('data', (chunk) => stream.push(chunk));
    doc.on('end', () => stream.push(null));
    doc.on('error', (err) => stream.destroy(err));
    // --------------------------------

    if (headerImagePath) {
      const pageWidth = doc.page.width;
      doc.image(headerImagePath, 0, 0, {
        width: pageWidth,
        align: 'center',
      });
    }

    doc.moveDown();
    doc.moveDown();

    doc.font('Helvetica-Bold');
    doc.fillColor('#468F5D');
    doc.fontSize(30).text('CÉDULA DE PRODUTO RURAL', { align: 'center' });

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

    // ASSINATURA

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

    // Adiciona paginação
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

    // finaliza doc
    doc.flushPages();

    doc.end();

    return stream;
  }
}
