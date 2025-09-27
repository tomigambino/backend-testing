import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
    imports: [CustomerModule],
    controllers: [AuthController],
    providers: [AuthService, JwtService],
    exports: [AuthService], // opcional, si lo usás en otros módulos
})
export class AuthModule { }
