import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { RedisService } from 'nestjs-redis';
import * as Utils from '../utils/random-nickname';
import { REDIS_ACTIVE_USERS_MAP } from './constants';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let redisService: RedisService;

  const mockUserId = 'mockUserId';
  const mockUserId2 = 'mockUserId2';

  const serverMock: any = {
    emit: jest.fn(),
  };

  const clientSocketMock: any = {
    id: 10001,
    emit: jest.fn(),
    broadcast: {
      emit: jest.fn(),
    },
  };

  const redisServiceMock = {
    getClient: jest.fn().mockReturnValue({
      del: jest.fn(),
      hdel: jest.fn().mockReturnValue('hdel'),
      hget: jest.fn().mockReturnValue(mockUserId),
      hset: jest.fn(),
      hvals: jest.fn().mockReturnValue([mockUserId]),
    }),
  };

  jest
    .spyOn(global.Date.prototype, 'toLocaleString')
    .mockImplementation(() => 'Mocked Date');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        { provide: RedisService, useValue: redisServiceMock },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    gateway.server = serverMock;

    redisService = module.get<RedisService>(RedisService);

    jest.spyOn(Utils, 'default').mockReturnValue(mockUserId2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should clear active users map in redis', () => {
    expect(redisService.getClient().del).toBeCalled();
  });

  describe('#handleMessage', () => {
    it('should emit a message to the server', async () => {
      const payload = 'mock message';
      const expectedResult = {
        msg: payload,
        user: mockUserId,
        time: new Date().toLocaleString(),
      };

      await gateway.handleMessage(clientSocketMock, payload);
      expect(redisService.getClient().hget).toHaveBeenCalledWith(
        REDIS_ACTIVE_USERS_MAP,
        clientSocketMock.id,
      );
      expect(gateway.server.emit).toHaveBeenCalledWith(
        'message',
        expectedResult,
      );
    });
  });

  describe('#handleConnection', () => {
    it('should emit messages to the client socket on connect', async () => {
      const expectedMessage = {
        msg: `Hello, ${mockUserId2}!`,
        currUserId: mockUserId2,
      };

      const expectedBroadcastMessaget = {
        msg: `User ${mockUserId2} join to chat.`,
      };

      const clientSocketMock2 = { ...clientSocketMock, id: 10002 };

      await gateway.handleConnection(clientSocketMock2);

      expect(clientSocketMock.emit).toBeCalledTimes(2);
      expect(clientSocketMock.emit).toHaveBeenCalledWith(
        'message',
        expectedMessage,
      );
      expect(clientSocketMock.emit).toHaveBeenCalledWith('activeUsers', [
        mockUserId,
      ]);

      expect(clientSocketMock.broadcast.emit).toBeCalledTimes(2);
      expect(clientSocketMock.broadcast.emit).toBeCalledWith(
        'message',
        expectedBroadcastMessaget,
      );
      expect(clientSocketMock.broadcast.emit).toBeCalledWith(
        'userConnected',
        mockUserId2,
      );

      expect(redisService.getClient().hset).toHaveBeenCalledWith(
        REDIS_ACTIVE_USERS_MAP,
        clientSocketMock2.id,
        mockUserId2,
      );
    });
  });

  describe('#handleDisconnect', () => {
    it('should emit messages to the client socket on disconnect', async () => {
      const expectedMessageResult = {
        msg: `User ${mockUserId} left from chat.`,
      };

      await gateway.handleDisconnect(clientSocketMock);

      expect(clientSocketMock.broadcast.emit).toBeCalledTimes(2);
      expect(clientSocketMock.broadcast.emit).toBeCalledWith(
        'message',
        expectedMessageResult,
      );
      expect(clientSocketMock.broadcast.emit).toBeCalledWith(
        'userDisconnected',
        mockUserId,
      );

      expect(redisService.getClient().hget).toHaveBeenCalledWith(
        REDIS_ACTIVE_USERS_MAP,
        clientSocketMock.id,
      );
    });
  });
});
