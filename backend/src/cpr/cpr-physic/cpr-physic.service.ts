import { Inject, Injectable } from '@nestjs/common';
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
import { PaymentEntity } from '../../entities/cpr/cpr.entity';
import { DefaultCprPhysicDocumentModel } from './default-cpr-physic-document-model';
import { createWriteStream } from 'fs';

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

    const {
      product,
      crop,
      quantity,
      paymentSchedule,
      value,
      responsibleForExpenses,
    } = createCprPhysicDto;
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
      value,
      responsibleForExpenses,
    });

    // TODO: criar lógica para elcolher o modelo a ser usado
    const document = this.cprDocumentFactory.createDocument(cpr);

    // const cprDocumentModel = new DefaultCprPhysicDocumentModel(cpr);
    // const doc = cprDocumentModel.generateDocument();
    // doc.pipe(createWriteStream('cpr.pdf'));

    super.save(cpr);

    return { id: cpr.id };
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
