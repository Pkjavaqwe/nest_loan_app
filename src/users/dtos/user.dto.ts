import { Expose } from 'class-transformer';

// Response DTO - only these fields will be returned
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  role: string;

  @Expose()
  createdAt: Date;
}
