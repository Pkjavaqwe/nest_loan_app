import { Controller, Post, Get, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { LoanService } from './loan.service';
import { CreateLoanDto, ProcessLoanDto } from './dto/loan.dto';
import { LoanDto } from './dto/loan-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../auth/enums/role.enum';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('loans')
@UseGuards(JwtAuthGuard)
@Serialize(LoanDto)
export class LoanController {
  constructor(private loanService: LoanService) {}

  @Post('request')
  @UseGuards(RoleGuard(Role.CUSTOMER))
  async customerRequestLoan(
    @Body() createLoanDto: CreateLoanDto,
    @CurrentUser() user: any,
  ) {
    return this.loanService.createLoanRequest(createLoanDto, user.userId, user.role);
  }

  @Post('request-for-customer')
  @UseGuards(RoleGuard(Role.SALES))
  async salesRequestLoan(
    @Body() createLoanDto: CreateLoanDto,
    @CurrentUser() user: any,
  ) {
    return this.loanService.createLoanRequest(createLoanDto, user.userId, user.role);
  }

  @Post(':id/approve')
  @UseGuards(RoleGuard(Role.FINANCER))
  async approveLoan(
    @Param('id', ParseIntPipe) id: number,
    @Body() processDto: ProcessLoanDto,
    @CurrentUser() user: any,
  ) {
    return this.loanService.approveLoan(id, user.userId, processDto);
  }

  @Post(':id/reject')
  @UseGuards(RoleGuard(Role.FINANCER))
  async rejectLoan(
    @Param('id', ParseIntPipe) id: number,
    @Body() processDto: ProcessLoanDto,
    @CurrentUser() user: any,
  ) {
    return this.loanService.rejectLoan(id, user.userId, processDto);
  }

  @Get('all')
  @UseGuards(RoleGuard(Role.FINANCER))
  async getAllLoans() {
    return this.loanService.findAll();
  }

  @Get('pending')
  @UseGuards(RoleGuard(Role.FINANCER))
  async getPendingLoans() {
    return this.loanService.findPendingLoans();
  }

  @Get('my-loans')
  @UseGuards(RoleGuard(Role.CUSTOMER))
  async getMyLoans(@CurrentUser() user: any) {
    return this.loanService.findByCustomerId(user.userId);
  }

  @Get('my-requests')
  @UseGuards(RoleGuard(Role.SALES))
  async getMyRequests(@CurrentUser() user: any) {
    return this.loanService.findByRequesterId(user.userId);
  }
}
