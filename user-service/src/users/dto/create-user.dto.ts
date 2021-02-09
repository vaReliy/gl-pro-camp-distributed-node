import { IsNotEmpty, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
