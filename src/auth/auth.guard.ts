import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { CustomerService } from 'src/customer/customer.service';
import { Role } from 'src/common/roles.enum';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { RequestWithUser } from 'src/common/interfaces/request-user';
import { JwtService } from 'src/common/jwt/jwt.service'; 

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService, 
    private readonly customerService: CustomerService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    try {
      const request: RequestWithUser = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) throw new UnauthorizedException('El token no existe');

      const payload = this.jwtService.getPayload(token, 'auth');

      // Buscamos el usuario en base al payload
      const customer = await this.customerService.findCustomerByEmail(payload.email);
      if (!customer) throw new UnauthorizedException('Usuario no encontrado');

      // Guardamos el usuario en la request
      request.customer = customer;

      // Roles requeridos
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRoles?.length) return true;

      if (!requiredRoles.includes(customer.role)) {
        throw new ForbiddenException('No tienes el rol necesario');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException(error?.message || 'Token inválido');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
