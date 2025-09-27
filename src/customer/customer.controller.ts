import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { PatchCustomerDto } from './dto/patch-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('cliente')
export class CustomerController {

    constructor(private customerService: CustomerService) {  }

    // El createCustomer se va a hacer desde el register
    //@Post()
    //createCustomer(@Body() createCustomerDto: CreateCustomerDto){
        //return this.customerService.createCustomer(createCustomerDto);
    //} 

    @Get()
    getAllCustomer(){
        return this.customerService.findAllCustomers();
    }

    @Get(':id')
    getCustomer(@Param('id') customerId){
        return this.customerService.findCustomerById(customerId);
    }

    @Put(':id')
    updateCustomer(@Param('id') customerId, @Body() updateCustomerDto: UpdateCustomerDto){
        return this.customerService.updateCustomer(customerId, updateCustomerDto);
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
