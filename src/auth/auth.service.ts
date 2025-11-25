import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { CustomerService } from 'src/customer/customer.service';
import { LoginCustomerDto } from './dto/login-user.dto';
import { CreateCustomerDto } from 'src/customer/dto/create-customer.dto';
import { JwtService } from 'src/common/jwt/jwt.service';

@Injectable()
export class AuthService {
    constructor(
    private readonly jwtService: JwtService,
    private customerService: CustomerService,
  ) {}

  async register(dto: CreateCustomerDto) {
    // Verificamos si el usuario ya existe
    if (dto.email) {
        // Si se proporciona email, verificamos si ya existe
        const userExists = await this.customerService.existsByEmail(dto.email);
        if (userExists) throw new BadRequestException('Email ya registrado');
    }

    const hashedPassword = await hash(dto.password!, 10);
    return await this.customerService.createCustomer(dto, hashedPassword);
  }

  async login(dto: LoginCustomerDto) {
    const user = await this.customerService.findCustomerByEmail(dto.email);

    // Verificamos si la cuenta está bloqueada
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const lastMinutes = Math.ceil(
        (user.lockedUntil.getTime() - Date.now()) / 60000
      );
      throw new UnauthorizedException(
        `Cuenta bloqueada. Intenta en ${lastMinutes} minutos`
      );
    }

    // Reseteamos el bloqueo si ya expiró
    if (user.lockedUntil && user.lockedUntil <= new Date()) {
      await this.customerService.unlockAccount(user);
    }

    // Reseteamos los intentos si pasó mucho tiempo
    await this.customerService.resetAttemptsIfExpired(user);

    // Verificamos la contraseña
    const isPasswordValid = await compare(dto.password, user.password);
    
    if (!isPasswordValid) {
      await this.customerService.registerFailedLoginAttempt(user);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Login exitoso
    await this.customerService.resetLoginAttempts(user);

    // Generar token
    const payload = { email: user.email };
    const accessToken = this.jwtService.generateToken(payload);

    return { accessToken, roleId: user.role };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.getPayload(token);
      return { valid: true, payload };
    } catch (e) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  async getCustomerId(token): Promise<{ customerId: number }> {
    try {
      const payload = this.jwtService.getPayload(token);
      const customer = await this.customerService.findCustomerByEmail(payload.email)
      return { customerId: customer.id};
    } catch (e) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
