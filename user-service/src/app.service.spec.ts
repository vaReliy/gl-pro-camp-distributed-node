import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should build homepage string', () => {
    const mockIp = '1.1.1.1';
    const expectedresult = `<html>
  <h1>GL Pro Camp<h1/>
  <h2>Distributed node<h2/>
  <h3>Your IP address is: 1.1.1.1<h3/>
  <a href="/api">API<a/><br><br>
  <a href="/users">Users<a/>
  <html/>`;

    expect(service.getHomePage(mockIp)).toBe(expectedresult);
  });
});
