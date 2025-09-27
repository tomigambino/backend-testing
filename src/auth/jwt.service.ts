import { Injectable } from '@nestjs/common';
import { sign, verify, JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = 'superSecretKey'; // ⚠️ mover a env en producción
const JWT_EXPIRES_IN = '20m';

@Injectable()
export class JwtService {
  generateToken(payload: any): string {
    return sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  getPayload(token: string): JwtPayload {
    return verify(token, JWT_SECRET) as JwtPayload;
  }
}