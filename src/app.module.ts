import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './common/entities';
import { CustomerTypeModule } from './customerType/customerType.module';
import { SaleStateModule } from './saleStatus/saleStatus.module';
import { ProductTypeModule } from './productType/productType.module';
import { ProductModule } from './product/product.module';
import { SaleDetailModule } from './saleDetail/saleDetail.module';
import { SaleModule } from './sale/sale.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      database: 'impresion3d',
      username: 'postgres',
      password: 'postgres',
      synchronize: true,
      entities: entities,
    }),
    TypeOrmModule.forFeature(entities),
    CustomerModule,
    CustomerTypeModule,
    SaleStateModule,
    ProductTypeModule,
    ProductModule,
    SaleDetailModule,
    SaleModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
