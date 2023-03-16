import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  /**
   * The user name
   * @example 'admin'
   */
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  /**
   * User email
   * @example 'admin@example.com'
   */
  @ApiProperty()
  @IsEmail()
  email: string;
}
