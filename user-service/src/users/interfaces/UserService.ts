import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../schemas/user.schema';

export const USER_SERVICE = 'UserService';

export enum UserPermission {
  WRITE_TEXT = 'WRITE_TEXT',
  EDIT_USERS = 'EDIT_USERS',
}

export interface UserService {
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findOne(id: string): Promise<User>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
  remove(id: string): Promise<string>;
}
