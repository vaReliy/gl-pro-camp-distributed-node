import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

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
}
