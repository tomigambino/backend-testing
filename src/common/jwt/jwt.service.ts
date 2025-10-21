import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import * as dayjs from 'dayjs';
import { JwtPayload } from 'jsonwebtoken';
import { jwtConstants } from './jwt.constants';

@Injectable()
export class JwtService {
  // config.ts
  config = {
    auth: { //token de autenticación
      secret: jwtConstants.secretAuth,
      expiresIn: '15m', //Expira en 15 minutos
    },
    refresh: { //token de refresco
      secret: jwtConstants.secretRefresh,
      expiresIn: '1d', //Expira en 1 día
    },
  };

  generateToken(payload, type: 'refresh' | 'auth' = 'auth',): string {                                        //crea un JWT usando jsonwebtoken.sign()
    return sign(payload, this.config[type].secret, {
      expiresIn: this.config[type].expiresIn,
    });
  }

  refreshToken(refreshToken: string): { accessToken: string, refreshToken: string } { //obtiene el payload del refresh token y calcula el tiempo restante hasta la expiración usando dayjs
    try {
      const payload = this.getPayload(refreshToken, 'refresh')

      if (payload.exp === undefined) {
        throw new UnauthorizedException('Token inválido: sin fecha de expiración');
      }
      // Obtiene el tiempo restante en minutos hasta la expiración
      const timeToExpire = dayjs.unix(payload.exp).diff(dayjs(), 'minute');
      return { //si faltan menos de 20 minutos para que expire, genera un nuevo refresh token y si aun es valido lo reutiliza
        accessToken: this.generateToken({ email: payload.email }),
        refreshToken:
          timeToExpire < 20
            ? this.generateToken({ email: payload.email }, 'refresh')
            : refreshToken
      };
    } catch (error) {
      throw new UnauthorizedException(); //si el refreshToken no es valido lanza un error
    }
  }

  getPayload(token: string, type: 'refresh' | 'auth' = 'auth'): JwtPayload { //verifica el token con jsonwebtoken.verify()
    return verify(token, this.config[type].secret) as JwtPayload;
  }
}
