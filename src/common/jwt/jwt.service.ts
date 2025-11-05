import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';
import { jwtConstants } from './jwt.constants';

@Injectable()
export class JwtService {
  constructor(private jwtService: NestJwtService) {}

  config = {
    auth: {
      secret: jwtConstants.secretAuth,
      expiresIn: '15m',
    },
    refresh: {
      secret: jwtConstants.secretRefresh,
      expiresIn: '1d',
    },
  };

  generateToken(payload: any, type: 'refresh' | 'auth' = 'auth'): string {
    return this.jwtService.sign(payload, {
      secret: this.config[type].secret,
      expiresIn: this.config[type].expiresIn,
    });
  }

  refreshToken(refreshToken: string): { accessToken: string, refreshToken: string } {
    try {
      const payload = this.getPayload(refreshToken, 'refresh');

      if (payload.exp === undefined) {
        throw new UnauthorizedException('Token inválido: sin fecha de expiración');
      }

      const timeToExpire = dayjs.unix(payload.exp).diff(dayjs(), 'minute');
      
      return {
        accessToken: this.generateToken({ email: payload.email }),
        refreshToken:
          timeToExpire < 20
            ? this.generateToken({ email: payload.email }, 'refresh')
            : refreshToken
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  getPayload(token: string, type: 'refresh' | 'auth' = 'auth'): any {
    return this.jwtService.verify(token, {
      secret: this.config[type].secret,
    });
  }
}