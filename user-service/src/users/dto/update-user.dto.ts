import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  /**
   * The user id (string of 24 chars)
   * @example "1234567890qwertyuiop4"
   */
  id: string;
}
