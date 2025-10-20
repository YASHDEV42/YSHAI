import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([

        (request: Request): string | null => {
          console.log('Extracting JWT from request cookies or headers');

          if (request.cookies?.accessToken) {
            return request.cookies.accessToken;
          }
          // 2. Fallback to header
          const fromHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
          console.log('JWT extracted from header:', fromHeader);
          return fromHeader || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default_secret',
    });
  }

  validate(payload: { id: number; email: string; role: string }): { id: number, email: string, role: string } {
    return { id: payload.id, email: payload.email, role: payload.role };
  }
}
