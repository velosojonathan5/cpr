import { Test, TestingModule } from '@nestjs/testing';
import { CprPhysicService } from './cpr-physic.service';
import { CreateCprPhysicDto } from './dto/create-cpr-physic.dto';
import { CreditorService } from '../../creditor/creditor.service';
import { CRUDRepository } from '../../infra/repository/crud.repository';
import { CprEntity } from '../../entities/cpr/cpr.entity';
import { InMemoryRepository } from '../../infra/repository/in-memory/in-memory.repository';
import { CreditorEntity } from '../../entities/person/creditor.entity';
import { AddressEntity } from '../../entities/person/address.entity';
import {
  GenderEnum,
  IndividualEntity,
  MaritalStatusEnum,
  MatrimonialRegimeEnum,
} from '../../entities/person/individual.entity';
import { StateEnum } from '../../infra/entities/state-enum';
import { EmitterService } from '../../emitter/emitter.service';
import { EmitterEntity } from '../../entities/person/emitter.entity';
import { CompanyEntity } from '../../entities/person/company.entity';
import { ProductKeyEnum } from '../../entities/product.entity';

const mockCprDto: CreateCprPhysicDto = {
  creditor: {
    id: '0190a308-15df-725b-a6f3-4c591248221a',
  },
  emitter: {
    id: '0190a308-15df-725b-a6f3-4c591248221a',
  },
  productDevelopmentSite: {
    id: '0190a308-15df-725b-a6f3-4c591248221a',
    cultivatedArea: 10,
  },
  deliveryPlace: {
    id: '0190a308-15df-725b-a6f3-4c591248221a',
  },
  guarantor: {
    name: 'Paula Toller',
    phone: '31999880000',
    email: 'paula.toller@gmail.com',
    cpf: '56387187028',
    gender: GenderEnum.FEMALE,
    RG: 'MG22222',
    RGEmitedBy: 'SSP/MG',
    RGEmitedDate: new Date('2024-01-14T18:49:18.111Z'),
    maritalStatus: MaritalStatusEnum.MARRIED,
    matrimonialRegime: MatrimonialRegimeEnum.PARTIAL_COMMUNION,
    address: {
      postalCode: '30310-330',
      city: 'Belo Horizonte',
      state: StateEnum.MG,
      publicArea: 'Rua Albita',
      number: '820',
      district: 'string',
    },
    spouse: {
      name: 'Herbert Vianna',
      phone: '32999880000',
      email: 'herbert.vianna@gmail.com',
      cpf: '20991476042',
      gender: GenderEnum.MALE,
      RG: 'MG3333',
      RGEmitedBy: 'SSP/MG',
      RGEmitedDate: new Date('2024-01-11T18:49:18.111Z'),
      maritalStatus: MaritalStatusEnum.MARRIED,
      matrimonialRegime: MatrimonialRegimeEnum.PARTIAL_COMMUNION,
      address: {} as AddressEntity,
      cnpj: undefined,
      legalName: undefined,
      inscricaoEstadual: undefined,
    },
    cnpj: undefined,
    legalName: undefined,
    inscricaoEstadual: undefined,
  },
  product: ProductKeyEnum.SOY,
  crop: '2024/2025',
  quantity: 24580,
  paymentSchedule: [
    {
      dueDate: new Date('2024-07-11T19:07:32.565Z'),
      value: 10,
    },
  ],
  value: 10,
  currencyCode: 'BRL',
};

const mockAddress = AddressEntity.create({
  postalCode: '35585000',
  city: 'Pimenta',
  state: StateEnum.MG,
  publicArea: 'Rua Principal',
  number: '640',
  district: 'Centro',
  complement: 'apto 101',
  mailbox: '1234',
});

const mockLegalRepresentative = IndividualEntity.create({
  cpf: '13527694099',
  gender: GenderEnum.MALE,
  name: 'Antônio Alvarenga Silva',
  phone: '37999332222',
  email: 'antonio@pmginsumos.com',
  RG: 'MG111',
  RGEmitedBy: 'SSP/MG',
  RGEmitedDate: new Date('2024-07-13T18:49:18.111Z'),
  maritalStatus: MaritalStatusEnum.SINGLE,
});

const mockCreditor = CreditorEntity.create({
  name: 'Agro Insumos',
  cnpj: '88457902000100',
  legalName: 'Agro Insumos LTDA',
  inscricaoEstadual: '1111111',
  phone: '37999334679',
  email: 'adm@pmginsumos.com',
  address: mockAddress,
  legalRepresentative: mockLegalRepresentative,
});

const mockIndividualSpouse = IndividualEntity.create({
  name: 'Camilla Cabelo',
  phone: '37999885252',
  email: 'camilla@cientist.com',
  address: mockAddress,
  cpf: '90233070036',
  gender: GenderEnum.FEMALE,
  RG: 'MG574222',
  RGEmitedBy: 'SSP/SP',
  RGEmitedDate: new Date('2024-07-10T18:49:18.111Z'),
  maritalStatus: MaritalStatusEnum.SINGLE,
});

const mockIndividual = IndividualEntity.create({
  name: 'Galileo di Vincenzo Bonaulti de Galilei',
  phone: '37999888484',
  email: 'galileo@cientist.com',
  address: mockAddress,
  cpf: '54289266002',
  gender: GenderEnum.MALE,
  RG: 'MG574475',
  RGEmitedBy: 'SSP/SP',
  RGEmitedDate: new Date('2024-07-13T18:49:18.111Z'),
  maritalStatus: MaritalStatusEnum.MARRIED,
  spouse: mockIndividualSpouse,
  matrimonialRegime: MatrimonialRegimeEnum.UNIVERSAL_COMMINUION,
  profession: 'produtor rural',
});

const mockCompany = CompanyEntity.create({
  name: 'Fazenda dos Patos',
  cnpj: '44561357000114',
  legalName: 'Fazenda dos Patos LTDA',
  inscricaoEstadual: '1111111',
  phone: '37999334679',
  email: 'adm@pmginsumos.com',
  address: mockAddress,
  legalRepresentative: mockLegalRepresentative,
});

const mockEmitter = EmitterEntity.create(mockIndividual);

const mockEmitterCompany = EmitterEntity.create(mockCompany);

describe('CprPhysicService', () => {
  let service: CprPhysicService;
  let creditorService: CreditorService;
  let repository: CRUDRepository<CprEntity>;
  let creditorRepository: CRUDRepository<CreditorEntity>;
  let emitterService: EmitterService;
  let emitterRepository: CRUDRepository<EmitterEntity>;

  beforeEach(async () => {
    repository = new InMemoryRepository<CprEntity>();
    creditorRepository = new InMemoryRepository<CreditorEntity>();
    creditorService = new CreditorService(creditorRepository);

    repository['data'] = [];
    creditorRepository['data'] = [];

    emitterRepository = new InMemoryRepository<EmitterEntity>();
    emitterService = new EmitterService(emitterRepository);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CprPhysicService,
        { provide: CreditorService, useValue: creditorService },
        { provide: EmitterService, useValue: emitterService },
        { provide: 'KEY_REPOSITORY_CPR', useValue: repository },
      ],
    }).compile();

    service = module.get<CprPhysicService>(CprPhysicService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('test method create', () => {
    it('should create a physc CPR when emitter is an individual', async () => {
      creditorRepository.insert(mockCreditor);
      mockCprDto.creditor.id = mockCreditor.id;

      emitterRepository.insert(mockEmitter);
      mockCprDto.emitter.id = mockEmitter.id;

      const { id } = await service.create(mockCprDto);

      const createdCPR = await repository.getById(id);

      expect(id).toBeDefined();
      expect(createdCPR.number).toBeDefined();
      expect(createdCPR.creditor.cnpj).toBe('88457902000100');
      expect(createdCPR.creditor.name).toBe('Agro Insumos');

      expect(createdCPR.creditor.qualification).toBe(
        `Agro Insumos LTDA, pessoa jurídica de direito privado, inscrita no CNPJ 88.457.902/0001-00 e inscrição
      estadual nº 1111111, com sede na cidade de Pimenta/MG, à Rua Principal, nº
      640, apto 101, (1234) - Bairro: Centro, CEP: 35585-000, telefone de contato
      (37) 99933-4679, e-mail: adm@pmginsumos.com; representada neste ato pelo seu Sócio Administrador Antônio Alvarenga Silva portador de CPF 135.276.940-99.`,
      );

      expect(createdCPR.emitter.individual.cpf).toBe('54289266002');
      expect(createdCPR.emitter.name).toBe(
        'Galileo di Vincenzo Bonaulti de Galilei',
      );

      expect(createdCPR.emitter.qualification).toBe(
        `Galileo di Vincenzo Bonaulti de Galilei, Brasileiro(a), casado(a), produtor rural, portador(a) da cédula de identidade
      nº MG574475, SSP/SP, expedida em 13/07/2024, inscrito (a) no
      CPF nº 542.892.660-02, telefone de contato: (37) 99988-8484, e-mail: galileo@cientist.com, residente
      domiciliado(a) na cidade de Pimenta/MG, à Rua Principal, nº
      640, apto 101, (1234) - Bairro: Centro, CEP: 35585-000, casado(a) sob o regime de comunhão universal de bens com Camilla Cabelo,
      portador(a) da cédula de identidade nº MG574222, SSP/SP, expedida em 10/07/2024, 
      inscrito(a) no CPF nº 902.330.700-36.`,
      );

      expect(createdCPR.guarantor.qualification).toBe(
        `Paula Toller, Brasileiro(a), casado(a), portador(a) da cédula de identidade
      nº MG22222, SSP/MG, expedida em 14/01/2024, inscrito (a) no
      CPF nº 563.871.870-28, telefone de contato: (31) 99988-0000, e-mail: paula.toller@gmail.com, residente
      domiciliado(a) na cidade de Belo Horizonte/MG, à Rua Albita, nº
      820 - Bairro: string, CEP: 30310-330, casado(a) sob o regime de comunhão parcial de bens com Herbert Vianna,
      portador(a) da cédula de identidade nº MG3333, SSP/MG, expedida em 11/01/2024, 
      inscrito(a) no CPF nº 209.914.760-42.`,
      );

      expect(createdCPR.product.key).toBe('SOY');
      expect(createdCPR.product.name).toBe('Soja');
      expect(createdCPR.product.characteristics).toBe(
        'Até 13% de umidade, 0% de impurezas, até 6% de grãos avariados (grãos brotados, imaturos, chochos, danificados e com máximo de 6% de grãos mofados), grãos quebrados, partidos e amassados até 20%, até 6% de grãos esverdeados (grãos que apresentam coloração esverdeada na casca e na polpa), até 6% de grãos ardidos e 1% de grãos queimados. Padrão determinados conforme os conceitos definidos pelas Instruções Normativas MAPA número 11, 15/maio/2007 (D.O.U 16/05/2007) e número 37, 27/julho/2007 (D.O.U 30/07/2007).',
      );

      expect(createdCPR.crop).toBe('2024/2025');
      expect(createdCPR.quantity).toBe(24580);
      expect(createdCPR.sacas).toBe(409.6666666666667);
    });

    it('should create a physc CPR when emitter is a company', async () => {
      creditorRepository.insert(mockCreditor);
      mockCprDto.creditor.id = mockCreditor.id;

      emitterRepository.insert(mockEmitterCompany);
      mockCprDto.emitter.id = mockEmitterCompany.id;

      const { id } = await service.create(mockCprDto);

      const createdCPR = await repository.getById(id);

      expect(createdCPR.emitter.qualification).toBe(
        `Fazenda dos Patos LTDA, pessoa jurídica de direito privado, inscrita no CNPJ 44.561.357/0001-14 e inscrição
      estadual nº 1111111, com sede na cidade de Pimenta/MG, à Rua Principal, nº
      640, apto 101, (1234) - Bairro: Centro, CEP: 35585-000, telefone de contato
      (37) 99933-4679, e-mail: adm@pmginsumos.com; representada neste ato pelo seu Sócio Administrador Antônio Alvarenga Silva portador de CPF 135.276.940-99.`,
      );
    });

    it('should create a physc CPR when guarantor is a company', async () => {
      creditorRepository.insert(mockCreditor);
      mockCprDto.creditor.id = mockCreditor.id;

      emitterRepository.insert(mockEmitterCompany);
      mockCprDto.emitter.id = mockEmitterCompany.id;

      mockCprDto.guarantor = {
        name: 'Fazenda Agricampo',
        phone: '37999334679',
        email: 'agricampo@pmginsumos.com',
        cpf: undefined,
        gender: undefined,
        RG: undefined,
        RGEmitedBy: undefined,
        RGEmitedDate: undefined,
        maritalStatus: undefined,
        matrimonialRegime: undefined,
        spouse: undefined,
        address: {
          postalCode: '30310-330',
          city: 'Belo Horizonte',
          state: StateEnum.MG,
          publicArea: 'Rua Albita',
          number: '820',
          district: 'Cruzeiro',
        },
        cnpj: '34965283000128',
        legalName: 'Fazenda Agricampo LTDA',
        inscricaoEstadual: '2222222',
        legalRepresentative: {
          name: 'Paula Toller',
          phone: '31999880000',
          email: 'paula.toller@gmail.com',
          cpf: '13527694099',
          gender: GenderEnum.FEMALE,
          RG: 'MG22222',
          RGEmitedBy: 'SSP/MG',
          RGEmitedDate: new Date('2024-01-14T18:49:18.111Z'),
          maritalStatus: MaritalStatusEnum.SINGLE,
          address: {
            postalCode: '30310-330',
            city: 'Belo Horizonte',
            state: StateEnum.MG,
            publicArea: 'Rua Albita',
            number: '820',
            district: 'string',
          },
          spouse: undefined,
          cnpj: undefined,
          legalName: undefined,
          inscricaoEstadual: undefined,
        },
      };

      const { id } = await service.create(mockCprDto);

      const createdCPR = await repository.getById(id);

      expect(createdCPR.guarantor.qualification).toBe(
        `Fazenda Agricampo LTDA, pessoa jurídica de direito privado, inscrita no CNPJ 34.965.283/0001-28 e inscrição
      estadual nº 2222222, com sede na cidade de Belo Horizonte/MG, à Rua Albita, nº
      820 - Bairro: Cruzeiro, CEP: 30310-330, telefone de contato
      (37) 99933-4679, e-mail: agricampo@pmginsumos.com; representada neste ato pelo seu Sócio Administrador Paula Toller portador de CPF 135.276.940-99.`,
      );
    });
  });
});
