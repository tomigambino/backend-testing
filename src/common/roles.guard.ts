// src/common/roles.guard.ts
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './roles.enum';
import { ROLES_KEY } from './decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) {
      return true; // Si no se definieron roles, deja pasar
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user; // Este `user` debería venir del JWT o middleware de autenticación

    if (!user?.role) {
      throw new ForbiddenException('Rol de usuario no encontrado');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Acceso denegado: rol insuficiente');
    }

    return true;
  }
}
