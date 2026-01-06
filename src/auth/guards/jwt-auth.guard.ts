import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PUBLIC_ROUTES } from '../../config/public-routes';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (PUBLIC_ROUTES.includes(request.path)) {
      return true;
    }
    
    let token = request.session?.jwt;
    
    if (!token) {
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.replace('Bearer ', '');
      }
    }

    if (!token) {
      throw new UnauthorizedException('No token provided please login first');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      request.user = { userId: payload.sub, email: payload.email, role: payload.role };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
