import { Test, TestingModule } from '@nestjs/testing';
import { USER_SERVICE } from './interfaces/UserService';
import { UsersController } from './users.controller';
import { UsersLocalService } from './users.local.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: USER_SERVICE,
          useClass: UsersLocalService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
