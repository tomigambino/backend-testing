import { Module } from '@nestjs/common';
import { ProductTypeController } from './productType.controller';
import { ProductTypeService } from './productType.service';
import { ProductTypeEntity } from 'src/common/entities/productType';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductTypeEntity]),
  AuthModule],
  controllers: [ProductTypeController],
  providers: [ProductTypeService],
  exports: [ProductTypeService],
})
export class ProductTypeModule {}
