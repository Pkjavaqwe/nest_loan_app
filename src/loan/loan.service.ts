import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './loan.entity';
import { LoanStatus } from './enums/loan-status.enum';
import { CreateLoanDto, ProcessLoanDto } from './dto/loan.dto';
import { UsersService } from '../users/users.service';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
    private usersService: UsersService,
  ) {}

  async createLoanRequest(
    createLoanDto: CreateLoanDto,
    requestedById: number,
    requestedByRole: Role,
  ): Promise<Loan> {
    let customerId = createLoanDto.customerId;

    if (requestedByRole === Role.CUSTOMER) {
      customerId = requestedById;
    }

    if (requestedByRole === Role.SALES) {
      const customer = await this.usersService.findById(customerId);
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
      if (customer.role !== Role.CUSTOMER) {
        throw new BadRequestException('Loan can only be created for users with customer role');
      }
    }

    const loan = this.loanRepository.create({
      amount: createLoanDto.amount,
      purpose: createLoanDto.purpose,
      customerId,
      requestedById,
      status: LoanStatus.PENDING,
    });

    return this.loanRepository.save(loan);
  }

  async approveLoan(loanId: number, financerId: number, processDto: ProcessLoanDto): Promise<Loan> {
    const loan = await this.findLoanById(loanId);

    if (loan.status !== LoanStatus.PENDING) {
      throw new BadRequestException('Loan has already been processed');
    }

    loan.status = LoanStatus.APPROVED;
    loan.processedById = financerId;
    loan.remarks = processDto.remarks;

    return this.loanRepository.save(loan);
  }

  async rejectLoan(loanId: number, financerId: number, processDto: ProcessLoanDto): Promise<Loan> {
    const loan = await this.findLoanById(loanId);

    if (loan.status !== LoanStatus.PENDING) {
      throw new BadRequestException('Loan has already been processed');
    }

    loan.status = LoanStatus.REJECTED;
    loan.processedById = financerId;
    loan.remarks = processDto.remarks;

    return this.loanRepository.save(loan);
  }

  async findAll(): Promise<Loan[]> {
    return this.loanRepository.find({
      relations: ['customer', 'requestedBy', 'processedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPendingLoans(): Promise<Loan[]> {
    return this.loanRepository.find({
      where: { status: LoanStatus.PENDING },
      relations: ['customer', 'requestedBy'],
      order: { createdAt: 'ASC' },
    });
  }

  async findByCustomerId(customerId: number): Promise<Loan[]> {
    return this.loanRepository.find({
      where: { customerId },
      relations: ['requestedBy', 'processedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByRequesterId(requesterId: number): Promise<Loan[]> {
    return this.loanRepository.find({
      where: { requestedById: requesterId },
      relations: ['customer', 'processedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  private async findLoanById(id: number): Promise<Loan> {
    const loan = await this.loanRepository.findOne({ where: { id } });
    if (!loan) {
      throw new NotFoundException('Loan not found');
    }
    return loan;
  }
}
