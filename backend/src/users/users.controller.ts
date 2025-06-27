import { Controller, Get, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

interface JwtUser {
  userId: string;
  email: string;
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('test')
  testAuth(@Req() req: Request) {
    console.log('Test endpoint - Request user:', req.user);
    return { message: 'JWT authentication working!', user: req.user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request) {
    console.log('Users Controller - Request user:', req.user);
    console.log('Users Controller - Request headers:', req.headers);
    
    const jwtUser = req.user as JwtUser;
    if (!jwtUser || !jwtUser.userId) {
      console.log('Users Controller - Invalid JWT user data');
      throw new UnauthorizedException('Invalid token');
    }
    
    console.log('Users Controller - Looking for user with ID:', jwtUser.userId);
    const user = await this.usersService.findById(jwtUser.userId);
    if (!user) {
      console.log('Users Controller - User not found in database');
      throw new UnauthorizedException('User not found');
    }
    
    console.log('Users Controller - User found:', user.toObject());
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }
}