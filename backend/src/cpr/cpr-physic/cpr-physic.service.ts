import { Injectable } from '@nestjs/common';
import {
  CreateCprPhysicDto,
  CreateGuarantorDto,
} from './dto/create-cpr-physic.dto';
import { CprPhysicEntity } from '../../entities/cpr/cpr-physic.entity';
import { CprService } from '../cpr.service';
import { GuarantorEntity } from '../../entities/person/guarantor.entity';
import { IndividualEntity } from '../../entities/person/individual.entity';
import { CompanyEntity } from '../../entities/person/company.entity';
import { AddressEntity } from '../../entities/person/address.entity';
import { ProductEntity } from '../../entities/product.entity';
import * as PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { PaymentEntity } from '../../entities/cpr/cpr.entity';

@Injectable()
export class CprPhysicService extends CprService<CprPhysicEntity> {
  async create(
    createCprPhysicDto: CreateCprPhysicDto,
  ): Promise<{ id: string }> {
    const creditor = await this.creditorService.getById(
      createCprPhysicDto.creditor.id,
    );

    const emitter = await this.emitterService.getById(
      createCprPhysicDto.emitter.id,
    );

    const deliveryPlace = await this.deliveryPlaceService.getById(
      createCprPhysicDto.deliveryPlace.id,
    );

    let guarantor: GuarantorEntity;

    if (createCprPhysicDto.guarantor) {
      guarantor = this.buildGuarantor(createCprPhysicDto.guarantor);
    }

    const productDevelopmentSite = emitter.getDevelopmentSite(
      createCprPhysicDto.productDevelopmentSite.id,
    );

    if (createCprPhysicDto.productDevelopmentSite.cultivatedArea) {
      productDevelopmentSite.cultivatedArea =
        createCprPhysicDto.productDevelopmentSite.cultivatedArea;
    }

    const { product, crop, quantity, paymentSchedule } = createCprPhysicDto;
    const cpr = CprPhysicEntity.create({
      creditor,
      emitter,
      guarantor,
      product: ProductEntity.findByKey(product),
      crop,
      quantity,
      productDevelopmentSite,
      paymentSchedule: paymentSchedule.map((p) =>
        PaymentEntity.create(p.dueDate, p.value),
      ),
      deliveryPlace,
    });

    // arquitetura orientada a eventos?
    // this.generateDocument(cpr);

    super.save(cpr);

    return { id: cpr.id };
  }

  private generateDocument(cpr: CprPhysicEntity) {
    const sanitize = (text: string) => {
      return text.replace(/(\r\n|\n|\r)/gm, '');
    };

    const sections = [
      {
        title: 'Nº ' + cpr.number,
        content: '',
      },
      {
        title: 'CREDORA',
        content: sanitize(cpr.creditor.qualification),
      },
      {
        title: 'EMITENTE',
        content: sanitize(cpr.creditor.qualification),
      },
      {
        title: 'INTERVENIENTE GARANTIDOR',
        content: sanitize(cpr.guarantor.qualification),
      },
      {
        title: '1) DO OBJETO',
        content:
          'Fornecimento de produtos e insumos agrícolas pela CREDORA para o EMITENTE, em troca/BARTER de parte ou totalidade de sua safra para saldar o débito existente com a CREDORA.',
      },
      {
        title: '2) DO PRODUTO',
        content: `${cpr.product.name} em Grãos, safra agrícola ${cpr.crop}.`,
      },
      {
        title: '3) DAS CARACTERÍSTICAS DO PRODUTO:',
        content: sanitize(cpr.product.characteristics),
      },
      {
        title: '4) DA QUANTIDADE',
        content: `${cpr.quantityFormatted} Kg equivalentes a ${cpr.sacasFormatted} sacas de 60 kg cada uma.`,
      },
      {
        title: '5) DO ACONDICIONAMENTO',
        content: `A granel`,
      },
      {
        title: '6) DO LOCAL DE FORMAÇÃO DA LAVOURA',
        content: ``,
        subContents: cpr.productDevelopmentSite.qualifications.map(
          (q) => q.label + ': ' + sanitize(q.content),
        ),
      },
      {
        title: '7) DAS CONDIÇÕES DE ENTREGA',
        content:
          'A entrega do PRODUTO objeto desta Cédula será realizada da seguinte forma:',
        subContents: [
          'a) Período de entrega: A primeira colheita na(s) área(s) mencionada na na cláusula “DO LOCAL DE FORMAÇÃO DA LAVOURA”  desta Cédula até a data de vencimento mencionada inicialmente (data de vencimento), comprometendo-me(nos) a entregar(em) o primeiro produto colhido, independentemente de estar ou não vencida esta Cédula;',
          'Local de entrega:',
        ],
      },
      {
        title: '',
        content: '',
      },
    ];

    const doc = new PDFDocument();

    // Pipe its output somewhere, like to a file or HTTP response
    // See below for browser usage
    doc.pipe(createWriteStream('output.pdf'));
    doc.font('Helvetica-Bold');
    doc.fillColor('#468F5D');
    doc.fontSize(48).text('CÉDULA', { align: 'center' });
    doc
      .fontSize(21)
      .text('DO PRODUTO RURAL', { align: 'center' })
      .fillColor('#468F5D');

    doc.fillColor('#000');
    sections.map((s) => {
      doc.fontSize(16);
      doc.font('Helvetica-Bold').text(s.title, { width: 410 });
      doc.fontSize(13);
      doc.font('Helvetica').text(s.content, { align: 'justify' });
      if (s.subContents) {
        s.subContents.map((sub) =>
          doc.font('Helvetica').text(sub, { align: 'justify' }),
        );
      }
    });

    // Finalize PDF file
    doc.end();
  }

  private buildGuarantor(
    createGuarantorDto: CreateGuarantorDto,
  ): GuarantorEntity {
    let individual: IndividualEntity;
    let company: CompanyEntity;

    if (createGuarantorDto.cpf) {
      let spouseData: IndividualEntity | undefined;

      if (createGuarantorDto.spouse) {
        const { spouse } = createGuarantorDto;

        spouseData = IndividualEntity.create({
          ...spouse,
          spouse: undefined,
          address: undefined,
        });
      }

      const address = AddressEntity.create(createGuarantorDto.address);

      individual = IndividualEntity.create({
        ...createGuarantorDto,
        spouse: spouseData,
        address,
      });
    } else if (createGuarantorDto.cnpj) {
      const address = AddressEntity.create(createGuarantorDto.address);
      const legalRepresentative = IndividualEntity.create({
        ...createGuarantorDto.legalRepresentative,
        spouse: undefined,
        address: undefined,
      });
      company = CompanyEntity.create({
        ...createGuarantorDto,
        address,
        legalRepresentative,
      });
    }
    return GuarantorEntity.create(individual || company);
  }
}
