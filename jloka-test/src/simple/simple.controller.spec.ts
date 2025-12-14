import { Test, TestingModule } from '@nestjs/testing';
import { SimpleController } from './simple.controller';
import { SimpleService } from './simple.service';

describe('SimpleController', () => {
  let controller: SimpleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimpleController],
      providers: [SimpleService],
    }).compile();

    controller = module.get<SimpleController>(SimpleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
