import { Controller, Post, Body, Session, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthResponseDto, RegisterResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { PasswordValidationPipe } from 'src/password-validation/password-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Serialize(RegisterResponseDto)
  register(@Body(new PasswordValidationPipe()) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Serialize(AuthResponseDto)
  async login(@Body(new PasswordValidationPipe()) loginDto: LoginDto, @Session() session: any) {
    const result = await this.authService.login(loginDto);
    session.jwt = result.access_token;
    session.userId = result.user.id;
    return result.user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Session() session: any) {
    session.jwt = null;
    session.userId = null;
    return { message: 'Logged out successfully' };
  }
}
