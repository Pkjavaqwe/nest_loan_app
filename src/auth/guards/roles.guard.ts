import { Injectable, CanActivate, ExecutionContext, Type } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export function RoleGuard(...allowedRoles: Role[]): Type<CanActivate> {
  @Injectable()
  class RoleGuardMix implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const { user } = context.switchToHttp().getRequest();
      if (!user) {
        return false;
      }
      return allowedRoles.includes(user.role);
    }
  }
  return RoleGuardMix;
}
