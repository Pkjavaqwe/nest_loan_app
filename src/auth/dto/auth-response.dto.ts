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
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  role: string;
}

export class RegisterResponseDto {
  @Expose()
  message: string;

  @Expose()
  userId: number;
}
