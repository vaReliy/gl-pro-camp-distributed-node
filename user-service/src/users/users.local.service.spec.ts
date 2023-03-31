import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UsersLocalService } from './users.local.service';

describe('UsersLocalService', () => {
  let service: UsersLocalService;
  let userModel: Model<User>;

  const mockUsers = [
    {
      username: 'Jhon',
      email: 'jhon@mock.com',
      permissions: ['WRITE_TEXT'],
    },
    {
      username: 'Stiven',
      email: 'stiv@mock.com',
      permissions: ['WRITE_TEXT'],
    },
  ];

  const mockUserModel = {
    new: jest.fn().mockResolvedValue(mockUsers[0]),
    constructor: jest.fn().mockResolvedValue(mockUsers[0]),
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersLocalService,
        { provide: getModelToken('User'), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<UsersLocalService>(UsersLocalService);
    userModel = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#create', () => {
    it('should insert a new user by DTO data', async () => {
      const mockUserDto = {
        username: 'u1',
        email: 'u1@mock.com',
      };

      jest
        .spyOn(userModel, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockUserDto));

      const user = await service.create(mockUserDto);
      expect(user).toEqual(mockUserDto);
    });

    it('should throw BadRequestException when an error on the user creating', async () => {
      const mockUserDto = {
        username: 'u2',
        email: 'u2@mock.com',
      };
      const expectedError = {
        message: 'some error',
      };

      jest
        .spyOn(userModel, 'create')
        .mockImplementationOnce(() => Promise.reject(expectedError));

      const user = service.create(mockUserDto);
      await expect(user).rejects.toEqual(
        new BadRequestException(expectedError.message),
      );
    });
  });

  describe('#findAll', () => {
    it('should return all users', async () => {
      jest.spyOn(userModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUsers),
      } as any);

      const users = await service.findAll();
      expect(users).toEqual(mockUsers);
    });
  });

  describe('#findOne', () => {
    it('should return a user by ID if user exist', async () => {
      jest.spyOn(userModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUsers[0]),
      } as any);

      const user = await service.findOne('mockUserID');
      expect(user).toEqual(mockUsers[0]);
    });

    it('should throw NotFoundException exception if user does not exist', async () => {
      jest.spyOn(userModel, 'findById').mockReturnValue({
        exec: jest.fn().mockReturnValueOnce(null),
      } as any);

      const mockId = 'a9988cc77';
      const user = service.findOne(mockId);
      const expectedException = new NotFoundException(
        `User with id [${mockId}] doesn't exist`,
      );

      await expect(user).rejects.toEqual(expectedException);
    });
  });

  describe('#update', () => {
    it('should update if user exist', async () => {
      const mockUserId = 'existedUserIdMock';
      const userDto: any = {
        id: mockUserId,
        username: 'User 123',
        email: 'u123@mock.com',
        permissions: ['WRITE_TEXT'],
      };
      const mockUser: any = {
        ...mockUsers[0],
        id: mockUserId,
      };
      Object.setPrototypeOf(mockUser, {
        save: function () {
          return this;
        },
      });

      jest.spyOn(userModel, 'findById').mockReturnValue({
        exec: jest.fn().mockReturnValueOnce(mockUser),
      } as any);

      const user: any = await service.update(userDto.id, userDto);
      expect(user).toEqual(userDto);
    });
  });
});
