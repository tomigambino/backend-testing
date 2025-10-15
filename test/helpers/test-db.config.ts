import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/common/entities/customer.entity';
import { ImageEntity } from 'src/common/entities/image.entity';
import { PayEntity } from 'src/common/entities/pay.entity';
import { ProductEntity } from 'src/common/entities/product.entity';
import { ProductTypeEntity } from 'src/common/entities/productType';
import { SaleEntity } from 'src/common/entities/sale';
import { SaleDetailEntity } from 'src/common/entities/saleDetail';
import { SaleStatusEntity } from 'src/common/entities/saleStatus';

export const testDbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'postgres',
  database: 'testintegration',
  entities: [CustomerEntity, ImageEntity, PayEntity, ProductEntity, ProductTypeEntity, SaleEntity, SaleDetailEntity, SaleStatusEntity],
  synchronize: true,
  dropSchema: true,
  logging: false,
};