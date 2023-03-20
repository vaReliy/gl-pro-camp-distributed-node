import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UsersLocalService } from './users.local.service';

describe('UsersLocalService', () => {
  let service: UsersLocalService;
  let model: Model<User>;

  const mockUsers = [
    {
      username: 'Jhon',
      email: 'jhon@mock.com',
    },
    {
      username: 'Stiven',
      email: 'stiv@mock.com',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersLocalService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUsers[0]),
            constructor: jest.fn().mockResolvedValue(mockUsers[0]),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersLocalService>(UsersLocalService);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#findAll', () => {
    it('should return all users', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUsers),
      } as any);

      const users = await service.findAll();
      expect(users).toEqual(mockUsers);
    });
  });
});
