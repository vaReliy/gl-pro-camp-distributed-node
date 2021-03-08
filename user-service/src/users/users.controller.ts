import {
  Body,
  CACHE_MANAGER,
  CacheTTL,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RedisService } from 'nestjs-redis';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_SERVICE, UserService } from './interfaces/UserService';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(USER_SERVICE) private readonly usersService: UserService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache, // for manual reset cache
    private readonly redisService: RedisService,
  ) {
    redisService.getClient().set('hello', 'world').then();
    // cacheManager.reset();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @CacheTTL(10)
  async findAll() {
    console.log('gett data w/o cache');
    await new Promise((r) => setTimeout(r, 5000)); // fixme: for redis cache test
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
