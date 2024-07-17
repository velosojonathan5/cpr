import { Test, TestingModule } from '@nestjs/testing';
import { EmitterController } from './emitter.controller';
import { EmitterService } from './emitter.service';

describe('EmitterController', () => {
  let controller: EmitterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmitterController],
      providers: [{ provide: EmitterService, useValue: {} }],
    }).compile();

    controller = module.get<EmitterController>(EmitterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
