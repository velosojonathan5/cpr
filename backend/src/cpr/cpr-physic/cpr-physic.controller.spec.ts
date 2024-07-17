import { Test, TestingModule } from '@nestjs/testing';
import { CprPhysicController } from './cpr-physic.controller';
import { CprPhysicService } from './cpr-physic.service';

describe('CprPhysicController', () => {
  let controller: CprPhysicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CprPhysicController],
      providers: [{ provide: CprPhysicService, useValue: {} }],
    }).compile();

    controller = module.get<CprPhysicController>(CprPhysicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
