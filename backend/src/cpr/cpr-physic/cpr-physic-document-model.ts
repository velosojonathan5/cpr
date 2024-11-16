import { CprPhysicEntity } from '../../entities/cpr/cpr-physic.entity';
import * as PDFDocument from 'pdfkit';

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

export abstract class CprPhysicDocumentModel {
  protected abstract readonly sections: SectionTemplate[];

  constructor(protected readonly cpr: CprPhysicEntity) {}

  private getSections(): Section[] {
    return this.sections.map((section) => ({
      title: section.title ?? section.titleFn(this.cpr),
      content: section.content ?? section.contentFn(this.cpr),
    }));
  }

  protected abstract getSignatories(): Signatory[];

  public generateDocument(): PDFKit.PDFDocument {
    const sections = this.getSections();
    const signatories = this.getSignatories();

    const doc = new PDFDocument({ bufferPages: true });

    const imagePath = 'src/assets/images/capaPMG.jpg';
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

    return doc;
  }
}
