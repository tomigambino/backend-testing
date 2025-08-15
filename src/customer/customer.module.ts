import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerEntity } from 'src/common/entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerTypeModule } from 'src/customerType/customerType.module';


@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity]),
  CustomerTypeModule],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService]
})
export class CustomerModule {}
