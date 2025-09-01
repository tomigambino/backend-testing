import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './common/entities';
import { SaleStateModule } from './saleStatus/saleStatus.module';
import { ProductTypeModule } from './productType/productType.module';
import { ProductModule } from './product/product.module';
import { SaleDetailModule } from './saleDetail/saleDetail.module';
import { SaleModule } from './sale/sale.module';
import { CustomerModule } from './customer/customer.module';
import { PayModule } from './pay/pay.module';
import { ConfigModule } from '@nestjs/config';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      database: 'backendtesting',
      username: 'postgres',
      password: 'postgres',
      synchronize: true,
      entities: entities,
    }),
    TypeOrmModule.forFeature(entities),
    CustomerModule,
    SaleStateModule,
    ProductTypeModule,
    ProductModule,
    SaleDetailModule,
    SaleModule,
    PayModule,
    ImagesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
