// src/middlewares/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from './roles.enum';

export const ROLES_KEY = 'roles';

// Decorador que asigna roles a controladores o rutas
export const RolesDecorator = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
