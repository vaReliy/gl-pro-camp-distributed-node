import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './interfaces/UserService';

@Injectable()
export class UsersLocalService implements UserService {
  private users: User[] = [];

  async create(createUserDto: CreateUserDto): Promise<User> {
    await new Promise((res) => {
      setTimeout(res, 500);
    });
    const user = new User(
      uuid(),
      createUserDto.username,
      createUserDto.password,
    );

    this.users.push(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findOne(id: string): Promise<User> {
    const user = this.users.find((u) => u.id === id);

    if (!user) {
      throw new NotFoundException(`User with if ${id} doesn't exist`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    user.username = updateUserDto.username;
    user.password = updateUserDto.password;

    return user;
  }

  async remove(id: string): Promise<string> {
    this.users = this.users.filter((u) => u.id !== id);
    return `This action removes a #${id} user`;
  }
}
