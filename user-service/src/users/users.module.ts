import { Module } from '@nestjs/common';
import { USER_SERVICE } from './interfaces/UserService';
import { UsersController } from './users.controller';
import { UsersLocalService } from './users.local.service';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: USER_SERVICE,
      useClass: UsersLocalService,
    },
  ],
})
export class UsersModule {}
