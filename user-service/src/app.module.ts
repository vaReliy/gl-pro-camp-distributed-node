import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from 'nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
//import { WinstonModule} from 'nest-winston';
//import * as winston from 'winston';

//const logger = LoggerConfig = new LoggerConfig();

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL),
    RedisModule.register({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    }),
    //WinstonModule.forRoot(logger.console())
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
