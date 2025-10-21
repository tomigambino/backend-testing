import { Module } from '@nestjs/common';
import { SaleStateController } from './saleStatus.controller';
import { SaleStateService } from './saleStatus.service';
import { SaleStatusEntity } from 'src/common/entities/saleStatus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([SaleStatusEntity]), AuthModule],
  controllers: [SaleStateController],
  providers: [SaleStateService],
  exports: [SaleStateService]
})
export class SaleStateModule {}
