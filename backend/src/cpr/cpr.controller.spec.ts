import { Test, TestingModule } from '@nestjs/testing';
import { CprController } from './cpr.controller';
import { CprService } from './cpr.service';

describe('CprController', () => {
  let controller: CprController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CprController],
      providers: [{ provide: CprService, useValue: {} }],
    }).compile();

    controller = module.get<CprController>(CprController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
