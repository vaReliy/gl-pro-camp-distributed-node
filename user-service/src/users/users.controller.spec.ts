import { Test, TestingModule } from '@nestjs/testing';
import { USER_SERVICE } from './interfaces/UserService';
import { UsersController } from './users.controller';
import { CACHE_MANAGER } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

describe('UsersController', () => {
  let controller: UsersController;

  const userServiceMock = {
    create: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
  };

  const redisServiceMock = {
    getClient: jest.fn().mockReturnValue({
      set: jest.fn().mockReturnValue({
        then: jest.fn(),
      }),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: USER_SERVICE, useValue: userServiceMock },
        { provide: CACHE_MANAGER, useValue: {} },
        { provide: RedisService, useValue: redisServiceMock },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
