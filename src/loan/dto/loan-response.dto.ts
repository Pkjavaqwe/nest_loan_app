import { Expose, Type } from 'class-transformer';
import { UserDto } from '../../users/dtos/user.dto';

export class LoanDto {
  @Expose()
  id: number;

  @Expose()
  amount: number;

  @Expose()
  purpose: string;

  @Expose()
  status: string;

  @Expose()
  customerId: number;

  @Expose()
  @Type(() => UserDto)
  customer: UserDto;

  @Expose()
  requestedById: number;

  @Expose()
  @Type(() => UserDto)
  requestedBy: UserDto;

  @Expose()
  processedById: number;

  @Expose()
  @Type(() => UserDto)
  processedBy: UserDto;

  @Expose()
  remarks: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
