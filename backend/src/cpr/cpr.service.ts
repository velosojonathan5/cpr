import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../infra/service/base.service';
import { CprEntity, PaymentEntity } from '../entities/cpr/cpr.entity';
import { CRUDRepository } from '../infra/repository/crud.repository';
import { CreditorService } from '../creditor/creditor.service';
import { EmitterService } from '../emitter/emitter.service';
import { DeliveryPlaceService } from '../delivery-place/delivery-place.service';
import { CprDocumentFactory } from './cpr-document/cpr-document-factory';
import { GuarantorEntity } from '../entities/person/guarantor.entity';
import { ProductEntity } from '../entities/product.entity';
import { IndividualEntity } from '../entities/person/individual.entity';
import { CompanyEntity } from '../entities/person/company.entity';
import { AddressEntity } from '../entities/person/address.entity';
import { CreateCprDto, CreateGuarantorDto } from './dto/create-cpr.dto';
import { Stream } from 'stream';
import { FileManagerClient } from '../file-manager-client/file-manager-client';

@Injectable()
export class CprService extends BaseService<CprEntity> {
  constructor(
    @Inject('KEY_REPOSITORY_CPR')
    protected readonly cprRepository: CRUDRepository<CprEntity>,
    @Inject('CPR_DOCUMENT_FACTORY')
    protected readonly cprDocumentFactory: CprDocumentFactory,
    @Inject('FILE_MANAGER_CLIENT')
    protected readonly fileManagerClient: FileManagerClient,
    protected readonly creditorService: CreditorService,
    protected readonly emitterService: EmitterService,
    protected readonly deliveryPlaceService: DeliveryPlaceService,
  ) {
    super(cprRepository);
  }

  async getById(id: string): Promise<CprEntity> {
    const cpr = await super.getById(id);

    cpr.signedUrl = await this.fileManagerClient.getSignedUrl(
      `cpr-documents/${cpr.id}.pdf`,
    );

    return cpr;
  }

  async create(createCprDto: CreateCprDto): Promise<{ id: string }> {
    const creditor = await this.creditorService.getById(
      createCprDto.creditor.id,
    );

    const emitter = await this.emitterService.getById(createCprDto.emitter.id);

    const deliveryPlace = await this.deliveryPlaceService.getById(
      createCprDto.deliveryPlace.id,
    );

    let guarantor: GuarantorEntity;

    if (createCprDto.guarantor) {
      guarantor = this.buildGuarantor(createCprDto.guarantor);
    }

    const productDevelopmentSite = emitter.getDevelopmentSite(
      createCprDto.productDevelopmentSite.id,
    );

    if (createCprDto.productDevelopmentSite.cultivatedArea) {
      productDevelopmentSite.cultivatedArea =
        createCprDto.productDevelopmentSite.cultivatedArea;
    }

    const {
      product,
      crop,
      quantity,
      paymentSchedule,
      value,
      responsibleForExpenses,
    } = createCprDto;
    const cpr = CprEntity.create({
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

    const document: Stream = this.cprDocumentFactory.generateDocument(cpr);
    await this.fileManagerClient.save(document, {
      key: `cpr-documents/${cpr.id}.pdf`,
      contentType: 'application/pdf',
    });

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
