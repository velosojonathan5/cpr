import { Test, TestingModule } from '@nestjs/testing';
import { CprService } from './cpr.service';
import { CreditorService } from '../creditor/creditor.service';
import { CRUDRepository } from '../infra/repository/crud.repository';
import {
  CprEntity,
  ResponsibleForExpensesEnum,
} from '../entities/cpr/cpr.entity';
import { InMemoryRepository } from '../infra/repository/in-memory/in-memory.repository';
import { CreditorEntity } from '../entities/person/creditor.entity';
import { AddressEntity } from '../entities/person/address.entity';
import {
  GenderEnum,
  IndividualEntity,
  MaritalStatusEnum,
  MatrimonialRegimeEnum,
  Rg,
  SpouseEntity,
} from '../entities/person/individual.entity';
import { StateEnum } from '../infra/entities/state-enum';
import { EmitterService } from '../emitter/emitter.service';
import { EmitterEntity } from '../entities/person/emitter.entity';
import {
  CompanyEntity,
  LegalRepresentative,
} from '../entities/person/company.entity';
import { ProductKeyEnum } from '../entities/product.entity';
import {
  FarmEntity,
  PossessionEnum,
  SiteRegistry,
  RentRegistry,
} from '../entities/person/farm.entity';
import { DeliveryPlaceService } from '../delivery-place/delivery-place.service';
import { CprDocumentFactory } from './cpr-document/cpr-document-factory';
import { Readable } from 'node:stream';
import { CreateCprDto } from './dto/create-cpr.dto';
import { FileManagerClient } from '../file-manager-client/file-manager-client';

const mockCprDto: CreateCprDto = {
  creditor: {
    id: '0190a308-15df-725b-a6f3-4c591248221a',
  },
  emitter: {
    id: '0190a308-15df-725b-a6f3-4c591248221a',
  },
  productDevelopmentSite: {
    id: '0190a308-15df-725b-a6f3-4c591248221a',
    cultivatedArea: 540,
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
    rg: {
      number: 'MG22222',
      emitedBy: 'SSP/MG',
      emitedDate: new Date('2024-01-14T18:49:18.111Z'),
    },
    maritalStatus: MaritalStatusEnum.MARRIED,
    matrimonialRegime: MatrimonialRegimeEnum.PARTIAL_COMMUNION,
    address: {
      postalCode: '30310-330',
      city: 'Belo Horizonte',
      state: StateEnum.MG,
      publicArea: 'Rua Albita',
      district: 'string',
    },
    spouse: {
      name: 'Herbert Vianna',
      cpf: '20991476042',
      rg: {
        number: 'MG3333',
        emitedBy: 'SSP/MG',
        emitedDate: new Date('2024-01-11T18:49:18.111Z'),
      },
    },
    cnpj: undefined,
    legalName: undefined,
    inscricaoEstadual: undefined,
    legalRepresentative: undefined,
  },
  product: ProductKeyEnum.SOY,
  crop: '2024/2025',
  quantity: 24580,
  paymentSchedule: [
    {
      dueDate: new Date('2024-07-11T19:07:32.565Z'),
      value: 5000,
    },
    {
      dueDate: new Date('2024-08-11T19:07:32.565Z'),
      value: 5000,
    },
  ],
  responsibleForExpenses: ResponsibleForExpensesEnum.EMITTER,
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

const mockLegalRepresentative = new LegalRepresentative(
  'Antônio Alvarenga Silva',
  '13527694099',
);

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

const mockIndividualSpouse = SpouseEntity.create({
  name: 'Camilla Cabelo',
  cpf: '90233070036',
  rg: new Rg('MG574222', 'SSP/SP', new Date('2024-07-10T18:49:18.111Z')),
});

const mockIndividual = IndividualEntity.create({
  name: 'Galileo di Vincenzo Bonaulti de Galilei',
  phone: '37999888484',
  email: 'galileo@cientist.com',
  address: mockAddress,
  cpf: '54289266002',
  gender: GenderEnum.MALE,
  rg: new Rg('MG574475', 'SSP/SP', new Date('2024-07-13T18:49:18.111Z')),
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

const mockRegistry = SiteRegistry.create({
  number: 'PROP11333',
  regitryPlaceName: 'Cartório de Registro de imóveis',
  address: mockAddress,
  book: 'L5000',
  sheet: 'F145',
  regitryDate: new Date('2022-07-13T18:49:18.111Z'),
});

const mockFarm = FarmEntity.create({
  name: 'Fazenda Dois Irmãos',
  inscricaoEstadual: '698468468',
  phone: '37999334671',
  email: 'fadois@gmail.com',
  address: mockAddress,
  legalRepresentative: undefined,
  tatalArea: 200,
  cultivatedArea: 540,
  nirf: 'NIRF7700',
  possession: PossessionEnum.OWNER,
  siteRegistry: mockRegistry,
});

const mockEmitter = EmitterEntity.create(mockIndividual, [mockFarm]);

const mockEmitterCompany = EmitterEntity.create(mockCompany, [mockFarm]);

const mockDeliveryPlace = CompanyEntity.create({
  name: 'Fazenda dos Patos 2',
  cnpj: '44561357000114',
  legalName: 'Fazenda dos Patos LTDA',
  inscricaoEstadual: '1111111',
  phone: '37999334679',
  email: 'adm@pmginsumos.com',
  address: AddressEntity.create({
    postalCode: '35585000',
    city: 'Pimenta',
    state: StateEnum.MG,
    publicArea: 'Rua Principal',
    number: '640',
    district: 'Centro',
  }),
});

describe('CprService', () => {
  let service: CprService;
  let repository: InMemoryRepository<CprEntity>;
  let cprDocumentFactory: CprDocumentFactory;
  let creditorService: CreditorService;
  let creditorRepository: CRUDRepository<CreditorEntity>;
  let emitterService: EmitterService;
  let emitterRepository: CRUDRepository<EmitterEntity>;
  let deliveryPlaceService: DeliveryPlaceService;
  let deliveryPlaceRepository: CRUDRepository<CompanyEntity>;
  let fileManagerClient: FileManagerClient;

  beforeEach(async () => {
    repository = new InMemoryRepository<CprEntity>();
    creditorRepository = new InMemoryRepository<CreditorEntity>();
    creditorService = new CreditorService(creditorRepository);

    emitterRepository = new InMemoryRepository<EmitterEntity>();
    emitterService = new EmitterService(emitterRepository);

    deliveryPlaceRepository = new InMemoryRepository<CompanyEntity>();
    deliveryPlaceService = new DeliveryPlaceService(deliveryPlaceRepository);

    fileManagerClient = {
      save: jest.fn(),
      getByKey: jest.fn(),
      getSignedUrl: jest.fn(),
    };

    cprDocumentFactory = {
      generateDocument: () =>
        new Readable({
          read() {},
        }),
    } as unknown as CprDocumentFactory;

    repository['data'] = [];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CprService,
        { provide: 'KEY_REPOSITORY_CPR', useValue: repository },
        { provide: CreditorService, useValue: creditorService },
        { provide: EmitterService, useValue: emitterService },
        { provide: DeliveryPlaceService, useValue: deliveryPlaceService },
        { provide: 'CPR_DOCUMENT_FACTORY', useValue: cprDocumentFactory },
        { provide: 'FILE_MANAGER_CLIENT', useValue: fileManagerClient },
      ],
    }).compile();

    service = module.get<CprService>(CprService);

    creditorRepository.insert(mockCreditor);
    mockCprDto.creditor.id = mockCreditor.id;

    emitterRepository.insert(mockEmitter);
    mockCprDto.emitter.id = mockEmitter.id;
    mockCprDto.productDevelopmentSite.id = mockFarm.id;

    deliveryPlaceRepository.insert(mockDeliveryPlace);
    mockCprDto.deliveryPlace.id = mockDeliveryPlace.id;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('test method getById', () => {
    it('should get a cpr by id and return it', async () => {
      fileManagerClient.getSignedUrl = jest
        .fn()
        .mockResolvedValue('http://signed.url');

      const { id } = await service.create(mockCprDto);

      const cpr = await service.getById(id);

      expect(cpr.signedUrl).toBe('http://signed.url');
    });
  });

  describe('test method create', () => {
    it('should create a physc CPR when emitter is an individual', async () => {
      const specificDate = new Date('2023-07-22T10:20:30Z');

      jest.useFakeTimers();
      jest.setSystemTime(specificDate);

      const { id } = await service.create(mockCprDto);

      const createdCPR = await repository.getById(id);

      expect(id).toBeDefined();
      expect(fileManagerClient.save).toHaveBeenCalledWith(
        expect.any(Readable),
        {
          key: `cpr-documents/${id}.pdf`,
          contentType: 'application/pdf',
        },
      );
      expect(createdCPR.number).toBeDefined();
      expect(createdCPR.creditor.cnpj).toBe('88457902000100');
      expect(createdCPR.creditor.name).toBe('Agro Insumos');

      expect(createdCPR.creditor.qualification).toBe(
        `Agro Insumos LTDA, pessoa jurídica de direito privado, inscrita no CNPJ 88.457.902/0001-00 e inscrição
      estadual nº 1111111, com sede na cidade de Pimenta/MG, à Rua Principal, nº 640, apto 101, (1234) - Bairro: Centro, CEP: 35585-000, telefone de contato
      (37) 99933-4679, e-mail: adm@pmginsumos.com; representada neste ato pelo seu Sócio Administrador Antônio Alvarenga Silva portador de CPF 135.276.940-99.`,
      );

      expect(createdCPR.emitter.individual.cpf).toBe('54289266002');
      expect(createdCPR.emitter.name).toBe(
        'Galileo di Vincenzo Bonaulti de Galilei',
      );

      expect(createdCPR.emitter.qualification).toBe(
        `Galileo di Vincenzo Bonaulti de Galilei, Brasileiro(a), casado(a), produtor rural, portador(a) da cédula de identidade nº MG574475, SSP/SP, expedida em 13/07/2024, inscrito (a) no
      CPF nº 542.892.660-02, telefone de contato: (37) 99988-8484, e-mail: galileo@cientist.com, residente
      domiciliado(a) na cidade de Pimenta/MG, à Rua Principal, nº 640, apto 101, (1234) - Bairro: Centro, CEP: 35585-000, casado(a) sob o regime de comunhão universal de bens com Camilla Cabelo,
      portador(a) da cédula de identidade nº MG574222, SSP/SP, expedida em 10/07/2024, 
      inscrito(a) no CPF nº 902.330.700-36.`,
      );

      expect(createdCPR.guarantor.qualification).toBe(
        `Paula Toller, Brasileiro(a), casado(a), portador(a) da cédula de identidade nº MG22222, SSP/MG, expedida em 14/01/2024, inscrito (a) no
      CPF nº 563.871.870-28, telefone de contato: (31) 99988-0000, e-mail: paula.toller@gmail.com, residente
      domiciliado(a) na cidade de Belo Horizonte/MG, à Rua Albita, Sem número - Bairro: string, CEP: 30310-330, casado(a) sob o regime de comunhão parcial de bens com Herbert Vianna,
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
      expect(createdCPR.sacasFormatted).toBe('409,67');
      expect(createdCPR.quantityFormatted).toBe('24.580,00');

      expect(createdCPR.productDevelopmentSite.cultivatedArea).toBe(540);

      expect(createdCPR.productDevelopmentSite.qualifications[0].label).toBe(
        'Imóvel rural',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[0].content).toBe(
        'Fazenda Dois Irmãos',
      );

      expect(createdCPR.productDevelopmentSite.qualifications[1].label).toBe(
        'Inscrição Estadual',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[1].content).toBe(
        '698468468',
      );

      expect(createdCPR.productDevelopmentSite.qualifications[2].label).toBe(
        'Localização do imóvel rural',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[2].content).toBe(
        `Pimenta/MG, à Rua Principal, nº 640, apto 101, (1234) - Bairro: Centro, CEP: 35585-000`,
      );

      expect(createdCPR.productDevelopmentSite.qualifications[3].label).toBe(
        'Área total em hectares',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[3].content).toBe(
        '200,00',
      );

      expect(createdCPR.productDevelopmentSite.qualifications[4].label).toBe(
        'Área cultivada em hectares',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[4].content).toBe(
        '540,00',
      );

      expect(createdCPR.productDevelopmentSite.qualifications[5].label).toBe(
        'NIRF',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[5].content).toBe(
        'NIRF7700',
      );

      expect(createdCPR.productDevelopmentSite.qualifications[6].label).toBe(
        'Posse',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[6].content).toBe(
        'proprietário',
      );

      expect(createdCPR.productDevelopmentSite.qualifications[7].label).toBe(
        'Número da matrícula',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[7].content).toBe(
        'PROP11333',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[8].label).toBe(
        'Cartório de registro da matrícula',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[8].content).toBe(
        'Cartório de Registro de imóveis, Pimenta/MG',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[9].label).toBe(
        'Livro e folha de registro da matrícula',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[9].content).toBe(
        'Livro L5000 na folha F145',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[10].label).toBe(
        'Data de registro da matrícula',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[10].content).toBe(
        '13/07/2022',
      );

      expect(createdCPR.paymentSchedule[0].qualification).toBe(
        `R$${String.fromCharCode(160)}5.000,00 com vencimento em 11/07/2024`,
      );
      expect(createdCPR.paymentSchedule[1].qualification).toBe(
        `R$${String.fromCharCode(160)}5.000,00 com vencimento em 11/08/2024`,
      );

      expect(createdCPR.paymentScheduleText).toBe(
        '1ª parcela de ' +
          createdCPR.paymentSchedule[0].qualification +
          ', 2ª parcela de ' +
          createdCPR.paymentSchedule[1].qualification,
      );
      expect(createdCPR.valueFormatted).toBe(
        `R$${String.fromCharCode(160)}10.000,00`,
      );

      expect(createdCPR.deliveryPlace.qualification)
        .toBe(`Fazenda dos Patos LTDA, pessoa jurídica de direito privado, inscrita no CNPJ 44.561.357/0001-14 e inscrição
      estadual nº 1111111, com sede na cidade de Pimenta/MG, à Rua Principal, nº 640 - Bairro: Centro, CEP: 35585-000, telefone de contato
      (37) 99933-4679, e-mail: adm@pmginsumos.com;`);

      expect(createdCPR.product.specialConditios).toBeDefined();

      expect(createdCPR.issueDate.toISOString()).toBe(
        specificDate.toISOString(),
      );

      expect(createdCPR.issueDateFormatted).toBe('22/07/2023');

      expect(createdCPR.responsibleForExpensesText).toBe(
        `O EMITENTE declara ter pleno conhecimento, e estar de pleno acordo, de que a CREDORA, efetuará uma retenção em reais, de acordo com sua tabela de descontos, destinada a remuneração dos serviços de entrega da mercadoria no Fazenda dos Patos LTDA, tais como: despesas de recebimento, limpeza, secagem da mercadoria; despesas de armazenagem e expedição da mercadoria; e todas as demais despesas operacionais e margem da CREDORA.`,
      );
    });

    it('should create a physc CPR when emitter is a company', async () => {
      creditorRepository.insert(mockCreditor);
      mockCprDto.creditor.id = mockCreditor.id;

      emitterRepository.insert(mockEmitterCompany);
      mockCprDto.emitter.id = mockEmitterCompany.id;

      deliveryPlaceRepository.insert(mockDeliveryPlace);
      mockCprDto.deliveryPlace.id = mockDeliveryPlace.id;

      const { id } = await service.create(mockCprDto);

      const createdCPR = await repository.getById(id);

      expect(createdCPR.emitter.qualification).toBe(
        `Fazenda dos Patos LTDA, pessoa jurídica de direito privado, inscrita no CNPJ 44.561.357/0001-14 e inscrição
      estadual nº 1111111, com sede na cidade de Pimenta/MG, à Rua Principal, nº 640, apto 101, (1234) - Bairro: Centro, CEP: 35585-000, telefone de contato
      (37) 99933-4679, e-mail: adm@pmginsumos.com; representada neste ato pelo seu Sócio Administrador Antônio Alvarenga Silva portador de CPF 135.276.940-99.`,
      );
    });

    it('should create a physc CPR when guarantor is a company', async () => {
      creditorRepository.insert(mockCreditor);
      mockCprDto.creditor.id = mockCreditor.id;

      emitterRepository.insert(mockEmitterCompany);
      mockCprDto.emitter.id = mockEmitterCompany.id;

      deliveryPlaceRepository.insert(mockDeliveryPlace);
      mockCprDto.deliveryPlace.id = mockDeliveryPlace.id;

      mockCprDto.guarantor = {
        name: 'Fazenda Agricampo',
        phone: '37999334679',
        email: 'agricampo@pmginsumos.com',
        cpf: undefined,
        gender: undefined,
        rg: undefined,
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
          cpf: '13527694099',
        },
      };

      const { id } = await service.create(mockCprDto);

      const createdCPR = await repository.getById(id);

      expect(createdCPR.guarantor.qualification).toBe(
        `Fazenda Agricampo LTDA, pessoa jurídica de direito privado, inscrita no CNPJ 34.965.283/0001-28 e inscrição
      estadual nº 2222222, com sede na cidade de Belo Horizonte/MG, à Rua Albita, nº 820 - Bairro: Cruzeiro, CEP: 30310-330, telefone de contato
      (37) 99933-4679, e-mail: agricampo@pmginsumos.com; representada neste ato pelo seu Sócio Administrador Paula Toller portador de CPF 135.276.940-99.`,
      );
    });

    it('Should throw exception when schedule payment sum is not equal to the CPR value', async () => {
      creditorRepository.insert(mockCreditor);
      mockCprDto.creditor.id = mockCreditor.id;

      emitterRepository.insert(mockEmitterCompany);
      mockCprDto.emitter.id = mockEmitterCompany.id;

      deliveryPlaceRepository.insert(mockDeliveryPlace);
      mockCprDto.deliveryPlace.id = mockDeliveryPlace.id;

      const { id } = await service.create(mockCprDto);

      const cpr = await repository.getById(id);
      expect(cpr.value).toBe(10000);
    });

    it('Should create a physical CPR when possession of the farm is Rent', async () => {
      const mockIndividual1 = IndividualEntity.create({
        name: 'Francesco di Vincenzo Bonaulti de Galilei',
        phone: '37999888484',
        email: 'Francesco@teste.com',
        address: mockAddress,
        cpf: '54289266002',
        gender: GenderEnum.MALE,
        rg: new Rg('MG574475', 'SSP/SP', new Date('2024-07-13T18:49:18.111Z')),
        maritalStatus: MaritalStatusEnum.SINGLE,
        profession: 'produtor rural',
      });

      const mockRentRegistry = RentRegistry.create({
        number: 'ARRED11333',
        initialDate: new Date('2024-07-13T18:49:18.111Z'),
        finalDate: new Date('2026-07-13T18:49:18.111Z'),
        regitryPlaceName: 'Cartório da comarca',
        address: mockAddress,
        book: 'L4500',
        sheet: 'F500',
        regitryDate: new Date('2024-07-13T18:49:18.111Z'),
      });

      const mockFarm1 = FarmEntity.create({
        name: 'Fazenda Albertos',
        inscricaoEstadual: '69846846855',
        phone: '37999334671',
        email: 'fazendaalbertos@teste.com',
        address: mockAddress,
        legalRepresentative: undefined,
        tatalArea: 5000,
        cultivatedArea: 1000,
        nirf: 'NIRF4141',
        possession: PossessionEnum.RENT,
        rentRegistry: mockRentRegistry,
      });

      const mockEmitterTest = EmitterEntity.create(mockIndividual1, [
        mockFarm1,
      ]);

      creditorRepository.insert(mockCreditor);
      mockCprDto.creditor.id = mockCreditor.id;

      emitterRepository.insert(mockEmitterTest);
      mockCprDto.emitter.id = mockEmitterTest.id;

      mockCprDto.productDevelopmentSite.id = mockFarm1.id;

      deliveryPlaceRepository.insert(mockDeliveryPlace);
      mockCprDto.deliveryPlace.id = mockDeliveryPlace.id;

      const { id } = await service.create(mockCprDto);

      const createdCPR = await repository.getById(id);

      expect(createdCPR.productDevelopmentSite.qualifications[0].label).toBe(
        'Imóvel rural',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[0].content).toBe(
        'Fazenda Albertos',
      );

      expect(createdCPR.productDevelopmentSite.qualifications[1].label).toBe(
        'Inscrição Estadual',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[1].content).toBe(
        '69846846855',
      );

      expect(createdCPR.productDevelopmentSite.qualifications[2].label).toBe(
        'Localização do imóvel rural',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[2].content).toBe(
        `Pimenta/MG, à Rua Principal, nº 640, apto 101, (1234) - Bairro: Centro, CEP: 35585-000`,
      );

      expect(createdCPR.productDevelopmentSite.qualifications[3].label).toBe(
        'Área total em hectares',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[3].content).toBe(
        '5.000,00',
      );

      expect(createdCPR.productDevelopmentSite.qualifications[4].label).toBe(
        'Área cultivada em hectares',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[4].content).toBe(
        '540,00',
      );

      expect(createdCPR.productDevelopmentSite.qualifications[5].label).toBe(
        'NIRF',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[5].content).toBe(
        'NIRF4141',
      );

      expect(createdCPR.productDevelopmentSite.qualifications[6].label).toBe(
        'Posse',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[6].content).toBe(
        'Arrendatário',
      );

      expect(createdCPR.productDevelopmentSite.qualifications[7].label).toBe(
        'Número da matrícula do arrendamento',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[7].content).toBe(
        'ARRED11333',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[8].label).toBe(
        'Cartório de registro da matrícula do arrendamento',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[8].content).toBe(
        'Cartório da comarca, Pimenta/MG',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[9].label).toBe(
        'Livro e folha de registro da matrícula do arrendamento',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[9].content).toBe(
        'Livro L4500 na folha F500',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[10].label).toBe(
        'Data de registro da matrícula do arrendamento',
      );
      expect(createdCPR.productDevelopmentSite.qualifications[10].content).toBe(
        '13/07/2024',
      );
    });

    it('regitryDate should return undefined', async () => {
      const mockIndividual2 = IndividualEntity.create({
        name: 'Francesco di Vincenzo Bonaulti de Galilei',
        phone: '37999888484',
        email: 'Francesco@teste.com',
        address: mockAddress,
        cpf: '54289266002',
        gender: GenderEnum.MALE,
        rg: new Rg('MG574475', 'SSP/SP', new Date('2024-07-13T18:49:18.111Z')),
        maritalStatus: MaritalStatusEnum.SINGLE,
        profession: 'produtor rural',
      });

      const mockFarm2 = FarmEntity.create({
        name: 'Fazenda Nove Irmãos',
        inscricaoEstadual: '698468468',
        phone: '37999334671',
        email: 'fadois@gmail.com',
        address: mockAddress,
        legalRepresentative: undefined,
        tatalArea: 200,
        cultivatedArea: 540,
        nirf: 'NIRF7700',
        possession: PossessionEnum.OWNER,
        siteRegistry: SiteRegistry.create({
          number: 'PROP11333',
          regitryPlaceName: 'Cartório de Registro de imóveis',
          address: undefined,
          book: 'L5000',
          sheet: 'F145',
          regitryDate: undefined,
        }),
      });

      const mockEmitter2 = EmitterEntity.create(mockIndividual2, [mockFarm2]);

      creditorRepository.insert(mockCreditor);
      mockCprDto.creditor.id = mockCreditor.id;

      emitterRepository.insert(mockEmitter2);
      mockCprDto.emitter.id = mockEmitter2.id;

      mockCprDto.productDevelopmentSite.id = mockFarm2.id;

      deliveryPlaceRepository.insert(mockDeliveryPlace);
      mockCprDto.deliveryPlace.id = mockDeliveryPlace.id;

      const { id } = await service.create(mockCprDto);

      const createdCPR = await repository.getById(id);

      expect(createdCPR.productDevelopmentSite.qualifications[10]).toBe(
        undefined,
      );
    });
  });
});
