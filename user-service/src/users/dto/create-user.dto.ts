import { IsNotEmpty, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  /**
   * User login
   * @example Ivan
   */
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  /**
   * User password
   * @example q1w2e3r4t5
   */
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
