import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';

// Interceptor to fetch full user and attach to request
// This pattern allows accessing full user data in routes
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.user || {};

    if (userId) {
      const user = await this.usersService.findById(userId);
      request.currentUser = user; // Attach full user object
    }

    return handler.handle();
  }
}
