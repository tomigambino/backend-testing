import { Body, Controller, Get, Post, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginCustomerDto } from './dto/login-user.dto';
import { CreateCustomerDto } from 'src/customer/dto/create-customer.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() dto: CreateCustomerDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    async login(@Body() dto: LoginCustomerDto) {
        return this.authService.login(dto);
    }

    @Get('validateToken')
    async validateToken(@Req() req) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) throw new UnauthorizedException('No token provided');

        const token = authHeader.split(' ')[1];
        return this.authService.validateToken(token);
    }
}
