import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  // Accessible by all authenticated users
  @Get()
  getGeneralDashboard(@CurrentUser() user: any) {
    return {
      message: `Welcome ${user.email}!`,
      role: user.role,
      timestamp: new Date().toISOString(),
    };
  }

  // SALES role only
  @Get('sales')
  @Roles(Role.SALES)
  getSalesDashboard(@CurrentUser() user: any) {
    return {
      message: 'Sales Dashboard',
      user: user.email,
      data: {
        totalLeads: 150,
        conversions: 45,
        revenue: '$125,000',
        topProducts: ['Product A', 'Product B', 'Product C'],
      },
    };
  }

  // CUSTOMER role only
  @Get('customer')
  @Roles(Role.CUSTOMER)
  getCustomerDashboard(@CurrentUser() user: any) {
    return {
      message: 'Customer Dashboard',
      user: user.email,
      data: {
        orders: 12,
        pendingOrders: 2,
        loyaltyPoints: 500,
        recommendations: ['Item 1', 'Item 2'],
      },
    };
  }

  // FINANCER role only
  @Get('financer')
  @Roles(Role.FINANCER)
  getFinancerDashboard(@CurrentUser() user: any) {
    return {
      message: 'Finance Dashboard',
      user: user.email,
      data: {
        totalRevenue: '$1,250,000',
        expenses: '$450,000',
        profit: '$800,000',
        pendingInvoices: 23,
      },
    };
  }

  // Accessible by SALES and FINANCER only
  @Get('reports')
  @Roles(Role.SALES, Role.FINANCER)
  getReports(@CurrentUser() user: any) {
    return {
      message: 'Reports - Accessible by Sales and Finance',
      user: user.email,
      reports: [
        { name: 'Q1 Report', status: 'completed' },
        { name: 'Q2 Report', status: 'pending' },
      ],
    };
  }
}
