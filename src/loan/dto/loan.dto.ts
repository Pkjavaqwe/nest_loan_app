import { IsNumber, IsString, IsOptional, IsPositive } from 'class-validator';

export class CreateLoanDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsOptional()
  purpose?: string;

  @IsNumber()
  customerId: number;
}

export class ProcessLoanDto {
  @IsString()
  @IsOptional()
  remarks?: string;
}
