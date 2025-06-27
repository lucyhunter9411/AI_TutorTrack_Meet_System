import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'defaultsecret',
    });
    console.log('JWT Strategy - Initialized with secret: defaultsecret');
  }

  async validate(payload: any) {
    console.log('JWT Strategy - Payload received:', payload);
    console.log('JWT Strategy - Token validation successful');
    
    if (!payload.sub || !payload.email) {
      console.log('JWT Strategy - Invalid payload structure');
      throw new UnauthorizedException('Invalid token payload');
    }
    
    console.log('JWT Strategy - Returning user data:', { userId: payload.sub, email: payload.email });
    return { userId: payload.sub, email: payload.email };
  }
}