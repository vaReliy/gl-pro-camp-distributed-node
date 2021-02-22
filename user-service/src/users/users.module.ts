import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_SERVICE } from './interfaces/UserService';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersLocalService } from './users.local.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: USER_SERVICE,
      useClass: UsersLocalService,
    },
  ],
})
export class UsersModule {}
