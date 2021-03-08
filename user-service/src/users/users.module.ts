import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as redis from 'cache-manager-ioredis';
import { RedisService } from 'nestjs-redis';
import { USER_SERVICE } from './interfaces/UserService';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersLocalService } from './users.local.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.registerAsync({
      useFactory: (redisService: RedisService) => {
        return {
          store: redis,
          redisInstance: redisService.getClient(),
        };
      },
      inject: [RedisService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: USER_SERVICE,
      useClass: UsersLocalService,
    },
    // {
    //   // global cache all @GET() methods:
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class UsersModule {}
