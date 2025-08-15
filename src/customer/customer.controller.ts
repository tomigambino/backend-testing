import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { PatchCustomerDto } from './dto/patch-customer.dto';

@Controller('cliente')
export class CustomerController {

    constructor(private customerService: CustomerService) {  }

    @Post()
    createCustomer(@Body() createCustomerDto: CreateCustomerDto){
        return this.customerService.createCustomer(createCustomerDto);
    } 

    @Get()
    getAllCustomer(){
        return this.customerService.findAllCustomers();
    }

    @Get(':id')
    getCustomer(@Param('id') customerId){
        return this.customerService.findCustomerById(customerId);
    }

    @Put(':id')
    updateCustomer(@Param('id') customerId, @Body() createCustomerDto: CreateCustomerDto){
        return this.customerService.updateCustomer(customerId, createCustomerDto);
    }

    @Patch(':id')
    partialUpdateCustomer(@Param('id') customerId, @Body() updateCustomerDto: PatchCustomerDto){
        return this.customerService.partialUpdateCustomer(customerId, updateCustomerDto);
    }

    @Delete(':id')
    @HttpCode(204)
    deleteCustomer(@Param('id') customerId){
        return this.customerService.deleteCustomer(customerId);
    }
}
