import { Test, TestingModule } from '@nestjs/testing';
import { CprService } from './cpr.service';
import { CprEntity } from '../entities/cpr/cpr.entity';
import { InMemoryRepository } from '../infra/repository/in-memory/in-memory.repository';
import { CreditorService } from '../creditor/creditor.service';
import { EmitterService } from '../emitter/emitter.service';
import { DeliveryPlaceService } from '../delivery-place/delivery-place.service';
import { CprDocumentFactory } from './cpr-document/cpr-document-factory';
import { Readable } from 'node:stream';

describe('CprService', () => {
  let service: CprService<CprEntity>;
  let repository: InMemoryRepository<CprEntity>;
  let cprDocumentFactory: CprDocumentFactory;

  beforeEach(async () => {
    repository = new InMemoryRepository<CprEntity>();
    cprDocumentFactory = {
      generateDocument: () =>
        new Readable({
          read() {},
        }),
    } as unknown as CprDocumentFactory;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CprService,
        { provide: 'KEY_REPOSITORY_CPR', useValue: repository },
        { provide: CreditorService, useValue: {} },
        { provide: EmitterService, useValue: {} },
        { provide: DeliveryPlaceService, useValue: {} },
        { provide: 'CPR_DOCUMENT_FACTORY', useValue: cprDocumentFactory },
      ],
    }).compile();

    service = module.get<CprService<CprEntity>>(CprService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
