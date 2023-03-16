import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './interfaces/UserService';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersLocalService implements UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = new this.userModel(createUserDto);
      return await user.save();
    } catch (error) {
      // todo: check error type and do throw nesessarry exeption
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findOne(id: string): Promise<User> {
    const user = this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(`User with if ${id} doesn't exist`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userModel.findById(id);
      user.username = updateUserDto.username ?? user.username;
      user.email = updateUserDto.email ?? user.email;
      return await user.save();
    } catch (error) {
      // todo: check error type and do throw nesessarry exeption
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string): Promise<string> {
    const user = this.userModel.findById(id);
    await user.remove();

    return `This action removes a #${id} user`;
  }
}
