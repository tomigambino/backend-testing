import { Module } from '@nestjs/common';
import { CustomerTypeController } from './customerType.controller';
import { CustomerTypeService } from './customerType.service';
import { CustomerTypeEntity } from 'src/common/entities/customerType';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerTypeEntity])],
  controllers: [CustomerTypeController],
  providers: [CustomerTypeService],
  exports: [CustomerTypeService]
})
export class CustomerTypeModule {}
