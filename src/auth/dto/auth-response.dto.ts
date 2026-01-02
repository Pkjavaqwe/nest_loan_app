import { Expose, Type } from 'class-transformer';

class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  role: string;
}

export class AuthResponseDto {
  @Expose()
  access_token: string;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}

export class RegisterResponseDto {
  @Expose()
  message: string;

  @Expose()
  userId: number;
}
