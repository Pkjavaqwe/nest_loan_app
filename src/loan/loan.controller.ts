import { Controller, Post, Get, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { LoanService } from './loan.service';
import { CreateLoanDto, ProcessLoanDto } from './dto/loan.dto';
import { LoanDto } from './dto/loan-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../auth/enums/role.enum';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('loans')
@UseGuards(JwtAuthGuard, RolesGuard)
@Serialize(LoanDto)
export class LoanController {
  constructor(private loanService: LoanService) {}

  @Post('request')
  @Roles(Role.CUSTOMER)
  async customerRequestLoan(
    @Body() createLoanDto: CreateLoanDto,
    @CurrentUser() user: any,
  ) {
    return this.loanService.createLoanRequest(createLoanDto, user.userId, user.role);
  }

  @Post('request-for-customer')
  @Roles(Role.SALES)
  async salesRequestLoan(
    @Body() createLoanDto: CreateLoanDto,
    @CurrentUser() user: any,
  ) {
    return this.loanService.createLoanRequest(createLoanDto, user.userId, user.role);
  }

  @Post(':id/approve')
  @Roles(Role.FINANCER)
  async approveLoan(
    @Param('id', ParseIntPipe) id: number,
    @Body() processDto: ProcessLoanDto,
    @CurrentUser() user: any,
  ) {
    return this.loanService.approveLoan(id, user.userId, processDto);
  }

  @Post(':id/reject')
  @Roles(Role.FINANCER)
  async rejectLoan(
    @Param('id', ParseIntPipe) id: number,
    @Body() processDto: ProcessLoanDto,
    @CurrentUser() user: any,
  ) {
    return this.loanService.rejectLoan(id, user.userId, processDto);
  }

  @Get('all')
  @Roles(Role.FINANCER)
  async getAllLoans() {
    return this.loanService.findAll();
  }

  @Get('pending')
  @Roles(Role.FINANCER)
  async getPendingLoans() {
    return this.loanService.findPendingLoans();
  }

  @Get('my-loans')
  @Roles(Role.CUSTOMER)
  async getMyLoans(@CurrentUser() user: any) {
    return this.loanService.findByCustomerId(user.userId);
  }

  @Get('my-requests')
  @Roles(Role.SALES)
  async getMyRequests(@CurrentUser() user: any) {
    return this.loanService.findByRequesterId(user.userId);
  }
}
