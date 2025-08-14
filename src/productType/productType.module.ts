import { Module } from '@nestjs/common';
import { ProductTypeController } from './productType.controller';
import { ProductTypeService } from './productType.service';
import { ProductTypeEntity } from 'src/common/entities/productType';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductTypeEntity])],
  controllers: [ProductTypeController],
  providers: [ProductTypeService],
  exports: [ProductTypeService],
})
export class ProductTypeModule {}
