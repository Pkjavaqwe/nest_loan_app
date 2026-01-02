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

  // Create loan request - by customer for self OR by sales on behalf of customer
  async createLoanRequest(
    createLoanDto: CreateLoanDto,
    requestedById: number,
    requestedByRole: Role,
  ): Promise<Loan> {
    let customerId = createLoanDto.customerId;

    // If customer is creating, they can only create for themselves
    if (requestedByRole === Role.CUSTOMER) {
      customerId = requestedById;
    }

    // If sales is creating, verify the customer exists and is actually a customer
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

  // Financer approves loan
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

  // Financer rejects loan
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

  // Get all loans (for financer)
  async findAll(): Promise<Loan[]> {
    return this.loanRepository.find({
      relations: ['customer', 'requestedBy', 'processedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  // Get pending loans (for financer)
  async findPendingLoans(): Promise<Loan[]> {
    return this.loanRepository.find({
      where: { status: LoanStatus.PENDING },
      relations: ['customer', 'requestedBy'],
      order: { createdAt: 'ASC' },
    });
  }

  // Get loans for a specific customer
  async findByCustomerId(customerId: number): Promise<Loan[]> {
    return this.loanRepository.find({
      where: { customerId },
      relations: ['requestedBy', 'processedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  // Get loans requested by a sales person
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
