import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => { console.log(request.cookies.accessToken); return request?.cookies?.accessToken; },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default_secret',
    });
  }

  validate(payload: { userId: number; email: string; role: string }) {
    return { userId: payload.userId, email: payload.email, role: payload.role };
  }
}
