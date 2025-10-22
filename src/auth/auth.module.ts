import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CustomerModule } from 'src/customer/customer.module';
import { JwtAuthModule } from 'src/common/jwt/jwt.module';
import { AuthGuard } from './auth.guard';
import { JwtService } from 'src/common/jwt/jwt.service';

@Module({
    imports: [
        forwardRef(() => CustomerModule), 
        JwtAuthModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService, AuthGuard],
    exports: [AuthService, AuthGuard, JwtService, CustomerModule],
})
export class AuthModule { }