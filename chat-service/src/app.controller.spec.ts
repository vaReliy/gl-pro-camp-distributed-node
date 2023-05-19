import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  class AppServiceMock {
    getHomePage = jest.fn((ip: string) => `ip is: ${ip}`);
  }

  let controller: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useClass: AppServiceMock }],
    }).compile();

    controller = app.get<AppController>(AppController);
  });

  it('should return homepage as html string', () => {
    const mockIp = 'mock ip address';
    const result = controller.getHomePage({ ip: mockIp });
    const expectedResult = `ip is: ${mockIp}`;

    expect(result).toBe(expectedResult);
  });
});
