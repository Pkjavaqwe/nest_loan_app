import { IsNumber, IsString, IsOptional, IsPositive } from 'class-validator';

export class CreateLoanDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsOptional()
  purpose?: string;

  @IsNumber()
  customerId: number; // Required when sales creates on behalf of customer
}

export class ProcessLoanDto {
  @IsString()
  @IsOptional()
  remarks?: string;
}
