import { Module } from '@nestjs/common';
import { SaleDetailController } from './saleDetail.controller';
import { SaleDetailService } from './saleDetail.service';
import { SaleDetailEntity } from 'src/common/entities/saleDetail';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from 'src/product/product.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([SaleDetailEntity]),
  ProductModule,
  AuthModule],
  controllers: [SaleDetailController],
  providers: [SaleDetailService],
  exports: [SaleDetailService]
})
export class SaleDetailModule { }
