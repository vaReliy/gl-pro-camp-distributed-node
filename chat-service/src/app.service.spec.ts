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

  it('should build homepage string for IP v4', () => {
    const mockIp = '1.1.1.1';
    const expectedresult = `<html>
  <h1>GL Pro Camp<h1/>
  <h2>Distributed node | chat-service<h2/>
  <h3>Your IP address is: 1.1.1.1<h3/>
  <html/>`;

    expect(service.getHomePage(mockIp)).toBe(expectedresult);
  });

  it('should build homepage string for IP v6', () => {
    const mockIp = '::ffff:192.168.55.123';
    const expectedresult = `<html>
  <h1>GL Pro Camp<h1/>
  <h2>Distributed node | chat-service<h2/>
  <h3>Your IP address is: 192.168.55.123<h3/>
  <html/>`;

    expect(service.getHomePage(mockIp)).toBe(expectedresult);
  });
});
