import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import * as Utils from '../utils/random-nickname';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let activeUsers: Map<string, string>;

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

  jest
    .spyOn(global.Date.prototype, 'toLocaleString')
    .mockImplementation(() => 'Mocked Date');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    gateway.server = serverMock;

    activeUsers = (gateway as any).activeUsers;
    activeUsers.set(clientSocketMock.id, mockUserId);

    jest.spyOn(Utils, 'default').mockReturnValue(mockUserId2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#handleMessage', () => {
    it('should emit a message to the server', () => {
      const payload = 'mock message';
      const expectedResult = {
        msg: payload,
        user: mockUserId,
        time: new Date().toLocaleString(),
      };

      gateway.handleMessage(clientSocketMock, payload);
      expect(gateway.server.emit).toHaveBeenCalledWith(
        'message',
        expectedResult,
      );
    });
  });

  describe('#handleConnection', () => {
    it('should emit messages to the client socket on connect', () => {
      const expectedMessage = {
        msg: `Hello, ${mockUserId2}!`,
        currUserId: mockUserId2,
      };

      const expectedBroadcastMessaget = {
        msg: `User ${mockUserId2} join to chat.`,
      };

      expect(activeUsers.size).toEqual(1);

      gateway.handleConnection({ ...clientSocketMock, id: 10002 });

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

      expect(activeUsers.size).toEqual(2);
    });
  });

  describe('#handleDisconnect', () => {
    it('should emit messages to the client socket on disconnect', () => {
      const expectedMessageResult = {
        msg: `User ${mockUserId} left from chat.`,
      };
      expect(activeUsers.size).toEqual(1);

      gateway.handleDisconnect(clientSocketMock);

      expect(clientSocketMock.broadcast.emit).toBeCalledTimes(2);
      expect(clientSocketMock.broadcast.emit).toBeCalledWith(
        'message',
        expectedMessageResult,
      );
      expect(clientSocketMock.broadcast.emit).toBeCalledWith(
        'userDisconnected',
        mockUserId,
      );

      expect(activeUsers.size).toEqual(0);
    });
  });
});
