import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { CustomerService } from 'src/customer/customer.service';
import { Role } from 'src/common/roles.enum';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { jwtConstants } from 'src/common/jwt/jwt.constants';
import { RequestWithUser } from 'src/common/interfaces/request-user';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService, // Servicio para verificar y decodificar tokens JWT
    private readonly customerService: CustomerService, // Servicio para acceder a los usuarios y sus roles
    private readonly reflector: Reflector, // Utilidad para acceder a metadata de decoradores
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Verifica si el endpoint es público usando el decorador @Public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true; // deja pasar sin token
    }

    try {
      const request: RequestWithUser = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException('El token no existe');
      }

      // Verifica el token y obtiene el payload decodificado
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secretAuth,
        algorithms: ['HS256'],
      });

      // Busca el usuario por su email desde el payload
      const customer = await this.customerService.findCustomerByEmail(payload.email);
      if (!customer) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      request.customer = customer; // Asigna el usuario al request

      // Obtiene los roles requeridos definidos en la metadata del endpoint
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      // Si no hay roles definidos, se permite el acceso
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      // Verifica si el rol del usuario está dentro de los requeridos
      if (!requiredRoles.includes(customer.role)) {
        throw new ForbiddenException('No tienes el rol necesario');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException(error?.message);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
