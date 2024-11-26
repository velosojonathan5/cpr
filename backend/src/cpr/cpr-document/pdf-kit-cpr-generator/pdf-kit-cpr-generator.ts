import { Readable } from 'node:stream';
import { CprDocument } from '../cpr-document';
import { CprDocumentGenerator } from '../cpr-document-generator';
import * as PDFDocument from 'pdfkit';

export class PDFKitCprGenerator implements CprDocumentGenerator {
  generate(data: CprDocument): Readable {
    const sections = data.sections;
    const signatories = data.signatures;

    const doc = new PDFDocument({ bufferPages: true });

    // PARTE DE CRIAR O READABLE STREAM
    // --------------------------------
    const stream = new Readable({
      read() {}, // Implementação vazia porque o pipe irá gerenciar o fluxo
    });

    doc.on('data', (chunk) => stream.push(chunk));
    doc.on('end', () => stream.push(null));
    doc.on('error', (err) => stream.destroy(err));
    // --------------------------------

    const imagePath = data.headerImage || 'src/assets/images/capaPMG.jpg';
    const pageWidth = doc.page.width;
    doc.image(imagePath, 0, 0, {
      width: pageWidth,
      align: 'center',
    });

    doc.moveDown();
    doc.moveDown();

    doc.font('Helvetica-Bold');
    doc.fillColor('#468F5D');
    doc.fontSize(30).text('CÉDULA DE PRODUTO RURAL', { align: 'center' });

    sections.forEach((s) => {
      if (!s.content && !s.content) {
        return;
      }

      doc.fontSize(16);
      doc.moveDown();

      const rectX = 0;
      const rectY = doc.y - 5;
      const rectWidth = 50;
      const rectHeight = 22;

      doc.rect(rectX, rectY, rectWidth, rectHeight).fill('#468F5D');

      doc.fillColor('#468F5D');

      doc.font('Helvetica-Bold').text(s.title);
      doc.moveDown(0.5);
      doc.fillColor('#000');
      doc.fontSize(13);
      if (typeof s.content === 'string') {
        doc.font('Helvetica').text(s.content, { align: 'justify' });
      } else if (s.content) {
        s.content.map((sub) => {
          doc.font('Helvetica').text(sub, { align: 'justify' });
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

    // PAGINAÇÂO
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);

      const oldBottomMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 0;
      doc.text(
        `Página ${i + 1} de ${pages.count}`,
        0,
        doc.page.height - oldBottomMargin / 2,
        { align: 'center' },
      );
      doc.page.margins.bottom = oldBottomMargin;
    }

    doc.flushPages();

    doc.end();

    return stream;
  }
}
