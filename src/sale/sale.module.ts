import { Module } from '@nestjs/common';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { SaleEntity } from 'src/common/entities/sale';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from 'src/customer/customer.module';
import { SaleDetailModule } from 'src/saleDetail/saleDetail.module';
import { SaleStateModule } from 'src/saleStatus/saleStatus.module';

@Module({
  imports: [TypeOrmModule.forFeature([SaleEntity]),
   CustomerModule,
   SaleDetailModule,
   SaleStateModule
  ],
  controllers: [SaleController],
  providers: [SaleService],
  exports: [SaleService]
})
export class SaleModule {}
