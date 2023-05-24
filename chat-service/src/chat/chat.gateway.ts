import { RedisService } from 'nestjs-redis';
import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import randomNickname from '../utils/random-nickname';
import { REDIS_ACTIVE_USERS_MAP } from './constants';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(ChatGateway.name);

  constructor(private readonly redisService: RedisService) {
    redisService.getClient().del(REDIS_ACTIVE_USERS_MAP);
  }

  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: string): Promise<void> {
    const redisClient = this.redisService.getClient();
    const name = await redisClient.hget(REDIS_ACTIVE_USERS_MAP, client.id);

    this.server.emit('message', {
      msg: payload,
      user: name,
      time: new Date().toLocaleString(),
    });
  }

  async handleConnection(client: Socket): Promise<void> {
    const name = randomNickname();
    const message = `User ${name} join to chat.`;
    const redisClient = this.redisService.getClient();
    const activeUsersValues = await redisClient.hvals(REDIS_ACTIVE_USERS_MAP);

    client.emit('message', { msg: `Hello, ${name}!`, currUserId: name });
    client.emit('activeUsers', Array.from(activeUsersValues));

    client.broadcast.emit('message', {
      msg: message,
    });
    client.broadcast.emit('userConnected', name);

    await redisClient.hset(REDIS_ACTIVE_USERS_MAP, client.id, name);
    this.logger.log(message);
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const redisClient = this.redisService.getClient();
    const { id } = client;
    const name = await redisClient.hget(REDIS_ACTIVE_USERS_MAP, id);
    const message = `User ${name} left from chat.`;

    client.broadcast.emit('message', {
      msg: message,
    });
    client.broadcast.emit('userDisconnected', name);

    this.logger.log(message);
    await redisClient.hdel(REDIS_ACTIVE_USERS_MAP, id);
  }
}
