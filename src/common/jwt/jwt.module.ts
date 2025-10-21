import { Module } from '@nestjs/common';
import { jwtConstants } from './jwt.constants';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';



@Module({
  imports:[
    PassportModule,
    JwtModule.register({
      global: true, //Sirve para no tener que importarlo en ningun otro lugar de la aplicación el JwtModule
      secret: jwtConstants.secretAuth,
      signOptions: { expiresIn: '1h', algorithm: 'HS256' },
      })],
  providers: [],
  exports: [JwtModule],
})
export class JwtAuthModule {}