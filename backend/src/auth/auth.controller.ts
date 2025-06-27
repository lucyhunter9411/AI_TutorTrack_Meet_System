import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string, password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: { email: string, password: string, role?: string }) {
    return this.authService.register(body.email, body.password, body.role);
  }

  @Get('test-jwt')
  testJwt() {
    const payload = { email: 'test@test.com', sub: 'test-id' };
    const token = this.jwtService.sign(payload);
    console.log('Test JWT - Token signed:', token);
    
    try {
      const decoded = this.jwtService.verify(token);
      console.log('Test JWT - Token verified:', decoded);
      return { token, decoded, success: true };
    } catch (error) {
      console.log('Test JWT - Token verification failed:', error);
      return { error: error.message, success: false };
    }
  }
}