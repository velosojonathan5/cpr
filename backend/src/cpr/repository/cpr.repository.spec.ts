import { Test, TestingModule } from '@nestjs/testing';
import { CprRepository } from './cpr.repository';
import { Repository } from 'typeorm';
import { CprModel } from './cpr.model';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CprRepository', () => {
  let cprRepository: CprRepository;
  let mockCprRepository: Repository<CprModel>;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CprRepository,
        {
          provide: getRepositoryToken(CprModel),
          useValue: mockRepository,
        },
      ],
    }).compile();

    cprRepository = module.get<CprRepository>(CprRepository);
    mockCprRepository = module.get<Repository<CprModel>>(
      getRepositoryToken(CprModel),
    );
  });

  it('should be defined', () => {
    expect(cprRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should call find and return all records', async () => {
      const mockRecords: CprModel[] = [
        { id: 1, name: 'Mock CPR' } as unknown as CprModel,
      ];
      mockCprRepository.find = jest.fn().mockResolvedValue(mockRecords);

      const result = await cprRepository.find();
      expect(mockCprRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockRecords);
    });
  });
});
