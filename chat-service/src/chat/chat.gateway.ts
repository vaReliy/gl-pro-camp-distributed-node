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

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger(ChatGateway.name);
  private activeUsers = new Map<string, string>(); // fixme: no local state!

  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string) {
    const name = this.activeUsers.get(client.id);

    this.server.emit('message', {
      msg: payload,
      user: name,
      time: new Date().toLocaleString(),
    });
  }

  handleConnection(client: Socket): any {
    const name = randomNickname();
    const message = `User ${name} join to chat.`;

    client.emit('message', { msg: `Hello, ${name}!`, currUserId: name });
    client.emit('activeUsers', Array.from(this.activeUsers.values()));

    client.broadcast.emit('message', {
      msg: message,
    });
    client.broadcast.emit('userConnected', name);

    this.activeUsers.set(client.id, name);
    this.logger.log(message);
  }

  handleDisconnect(client: Socket): any {
    const { id } = client;
    const name = this.activeUsers.get(id);
    const message = `User ${name} left from chat.`;

    client.broadcast.emit('message', {
      msg: message,
    });
    client.broadcast.emit('userDisconnected', name);

    this.logger.log(message);
    this.activeUsers.delete(id);
  }
}
