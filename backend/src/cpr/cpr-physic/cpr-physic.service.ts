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

    let guarantor: GuarantorEntity;

    if (createCprPhysicDto.guarantor) {
      guarantor = this.buildGuarantor(createCprPhysicDto.guarantor);
    }

    const { product, crop, quantity } = createCprPhysicDto;
    const cpr = CprPhysicEntity.create({
      creditor,
      emitter,
      guarantor,
      product: ProductEntity.findByKey(product),
      crop,
      quantity,
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
