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

  describe('#create', () => {
    it('should call UserService.create() with correct parameters', () => {
      const mockDto: any = { mock: 'data' };
      controller.create(mockDto);
      expect(userServiceMock.create).toBeCalledWith(mockDto);
    });
  });

  describe('#findAll', () => {
    it('should call UserService.findAll() with correct parameters', () => {
      controller.findAll();
      expect(userServiceMock.create).toBeCalled();
    });
  });

  describe('#findOne', () => {
    it('should call UserService.findOne() with correct parameters', () => {
      const mockId = '1234ss';
      controller.findOne(mockId);
      expect(userServiceMock.findOne).toBeCalledWith(mockId);
    });
  });

  describe('#update', () => {
    it('should call UserService.update() with correct parameters', () => {
      const mockId = '1234ss';
      const mockDto: any = { mock: 'data' };
      controller.update(mockId, mockDto);
      expect(userServiceMock.update).toBeCalledWith(mockId, mockDto);
    });
  });

  describe('#remove', () => {
    it('should call UserService.remove() with correct parameters', () => {
      const mockId = '1234ss';
      controller.remove(mockId);
      expect(userServiceMock.remove).toBeCalledWith(mockId);
    });
  });
});
