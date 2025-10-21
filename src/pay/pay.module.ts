import { Module } from '@nestjs/common';
import { PayController } from './pay.controller';
import { PayService } from './pay.service';
import { MercadoPagoService } from './mp.service';
import { SaleModule } from 'src/sale/sale.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayEntity } from 'src/common/entities/pay.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SaleModule,
    TypeOrmModule.forFeature([PayEntity]),
    AuthModule
  ],
  controllers: [PayController],
  providers: [PayService, MercadoPagoService]
})
export class PayModule {}
