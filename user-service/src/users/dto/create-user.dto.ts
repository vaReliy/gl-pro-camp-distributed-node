import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { UserPermission } from '../interfaces/UserService';

export class CreateUserDto {
  /**
   * The user name
   * @example 'Tony'
   */
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  /**
   * The user email
   * @example 'tony@example.com'
   */
  @IsEmail()
  email: string;

  /**
   * Array of the user permissions
   */
  permissions?: UserPermission[];
}
