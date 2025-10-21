import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { PatchCustomerDto } from './dto/patch-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesDecorator } from 'src/common/roles.decorator';
import { Role } from 'src/common/roles.enum';

@Controller('cliente')
@UseGuards(AuthGuard)
export class CustomerController {

    constructor(private customerService: CustomerService) {  }

    // El createCustomer se va a hacer desde el register
    //@Post()
    //createCustomer(@Body() createCustomerDto: CreateCustomerDto){
        //return this.customerService.createCustomer(createCustomerDto);
    //} 

    @Get()
    @RolesDecorator(Role.Owner || Role.Admin)
    getAllCustomer(){
        return this.customerService.findAllCustomers();
    }

    @Get(':id')
    @RolesDecorator(Role.Owner || Role.Admin)
    getCustomer(@Param('id') customerId){
        return this.customerService.findCustomerById(customerId);
    }

    @Put(':id')
    @RolesDecorator(Role.Owner || Role.Admin)
    updateCustomer(@Param('id') customerId, @Body() updateCustomerDto: UpdateCustomerDto){
        return this.customerService.updateCustomer(customerId, updateCustomerDto);
    }

    @Patch(':id')
    @RolesDecorator(Role.Owner || Role.Admin)
    partialUpdateCustomer(@Param('id') customerId, @Body() updateCustomerDto: PatchCustomerDto){
        return this.customerService.partialUpdateCustomer(customerId, updateCustomerDto);
    }

    @Delete(':id')
    @HttpCode(204)
    @RolesDecorator(Role.Owner || Role.Admin)
    deleteCustomer(@Param('id') customerId){
        return this.customerService.deleteCustomer(customerId);
    }
}
