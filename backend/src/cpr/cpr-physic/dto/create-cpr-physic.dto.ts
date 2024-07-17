import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import {
  GenderEnum,
  MaritalStatusEnum,
  MatrimonialRegimeEnum,
} from '../../../entities/person/individual.entity';
import { ProductKeyEnum } from '../../../entities/product.entity';

class BasicIdDto {
  @ApiProperty({ example: '0190a308-15df-725b-a6f3-4c591248221a' })
  @IsUUID()
  id: string;
}

class productDevelopmentSiteDto extends BasicIdDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsPositive()
  cultivatedArea?: number;
}

class CreateAddressDto {
  @ApiProperty()
  @IsString()
  postalCode: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  publicArea: string;

  @ApiProperty()
  @IsString()
  number: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty()
  @IsString()
  district: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  mailbox?: string;
}

class CreatePersonDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsObject()
  @Type(() => CreateAddressDto)
  @ValidateNested()
  address: CreateAddressDto;
}

// TODO condicionar obrigatoriede dos campos conforme tipo, se fo pessoa física ou juridica
export class CreateGuarantorDto extends CreatePersonDto {
  // TODO adicionar validação de CPF
  @ApiProperty()
  @IsOptional()
  @IsString()
  cpf: string;

  @ApiProperty({ enum: GenderEnum })
  @IsOptional()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty()
  @IsOptional()
  RG: string;

  @ApiProperty()
  @IsOptional()
  RGEmitedBy: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  RGEmitedDate: Date;

  @ApiProperty({ enum: MaritalStatusEnum })
  @IsOptional()
  maritalStatus: MaritalStatusEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  matrimonialRegime?: MatrimonialRegimeEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  spouse?: CreateGuarantorDto;

  @ApiProperty()
  @IsString()
  @IsOptional()
  cnpj: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  legalName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  inscricaoEstadual: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  legalRepresentative?: CreateGuarantorDto;
}

enum CurrencyCodeEnum {
  BRL = 'BRL',
}

enum CropEnum {
  '2024/2025' = '2024/2025',
  '2025/2026' = '2025/2026',
  '2026/2027' = '2026/2027',
  '2027/2028' = '2027/2028',
}

class CreatePaymentDto {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  dueDate: Date;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  value: number;
}

export class CreateCprPhysicDto {
  @ApiProperty({ description: 'Credor' })
  @IsObject()
  @Type(() => BasicIdDto)
  @ValidateNested()
  creditor: BasicIdDto;

  @ApiProperty({ description: 'Emitente' })
  @IsObject()
  @Type(() => BasicIdDto)
  @ValidateNested()
  emitter: BasicIdDto;

  @ApiProperty({ description: 'Local onde será desenvolvido o produto rural' })
  @IsObject()
  @Type(() => productDevelopmentSiteDto)
  @ValidateNested()
  productDevelopmentSite: productDevelopmentSiteDto;

  @ApiProperty({ description: 'local da entrega' })
  @IsObject()
  @Type(() => BasicIdDto)
  @ValidateNested()
  deliveryPlace: BasicIdDto;

  @ApiProperty({ description: 'Interveniente garantidor', required: false })
  @IsOptional()
  @IsObject()
  @Type(() => CreateGuarantorDto)
  @ValidateNested()
  guarantor?: CreateGuarantorDto;

  @ApiProperty({ enum: ProductKeyEnum, description: 'Produto' })
  @IsEnum(ProductKeyEnum)
  product: ProductKeyEnum;

  @ApiProperty({ enum: CropEnum, description: 'Safra' })
  // @IsEnum(CropEnum)
  // crop: CropEnum;
  crop: string;

  @ApiProperty({ description: 'Quantidade' })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({
    minItems: 1,
    type: [CreatePaymentDto],
    description: 'Cronograma de pagamento',
  })
  @Type(() => CreatePaymentDto)
  @ValidateNested()
  paymentSchedule: CreatePaymentDto[];

  @ApiProperty({ description: 'Valor' })
  @IsNumber()
  @IsPositive()
  value: number;

  @ApiProperty({ enum: CurrencyCodeEnum, description: 'Moeda' })
  // @IsEnum(CurrencyCodeEnum)
  // currencyCode: CurrencyCodeEnum;
  currencyCode: string;
}
