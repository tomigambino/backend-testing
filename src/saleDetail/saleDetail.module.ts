import { Module } from '@nestjs/common';
import { SaleDetailController } from './saleDetail.controller';
import { SaleDetailService } from './saleDetail.service';
import { SaleDetailEntity } from 'src/common/entities/saleDetail';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([SaleDetailEntity]),
  ProductModule],
  controllers: [SaleDetailController],
  providers: [SaleDetailService],
  exports: [SaleDetailService]
})
export class SaleDetailModule { }
