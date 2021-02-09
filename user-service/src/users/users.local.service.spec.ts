import { Test, TestingModule } from '@nestjs/testing';
import { UsersLocalService } from './users.local.service';

describe('UsersLocalService', () => {
  let service: UsersLocalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersLocalService],
    }).compile();

    service = module.get<UsersLocalService>(UsersLocalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
