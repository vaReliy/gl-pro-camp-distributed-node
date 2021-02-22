import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  /**
   * User login
   * @example Ivan
   */
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}
