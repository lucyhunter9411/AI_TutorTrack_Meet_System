import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { email: user.email, sub: user._id };
    console.log('Auth Service - Signing token with payload:', payload);
    const token = this.jwtService.sign(payload);
    console.log('Auth Service - Token signed successfully');
    
    return {
      access_token: token,
    };
  }

  async register(email: string, password: string, role?: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new UnauthorizedException('Email already exists');
    const user = await this.usersService.create(email, password, role);
    
    const payload = { email: user.email, sub: user._id };
    console.log('Auth Service - Signing token with payload:', payload);
    const token = this.jwtService.sign(payload);
    console.log('Auth Service - Token signed successfully');
    
    return {
      access_token: token,
    };
  }
}