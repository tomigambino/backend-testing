import { Body, Controller, Param, Post, Delete, Get, Put, HttpCode } from '@nestjs/common';
import { CreateCustomerTypeDto } from './dto/create-customerType.dto';
import { CustomerTypeService } from './customerType.service';

@Controller('tipoCliente')
export class CustomerTypeController {
    
    constructor(private customerTypeService: CustomerTypeService) {  }

    @Post()
    createCustomerType(@Body() customerType: CreateCustomerTypeDto){
        return this.customerTypeService.createCustomerType(customerType)
    }

    @Get()
    getAllCustomerType(){
        return this.customerTypeService.findAllCustomerType();
    }

    @Get(':id')
    getCustomerType(@Param('id') idCustomerType){
        return this.customerTypeService.findCustomerTypeById(idCustomerType);
    }

    @Put(':id')
    putCustomerType(@Param('id') customerTypeId, @Body() updateCustomerType: CreateCustomerTypeDto){
        return this.customerTypeService.updateCustomerType(customerTypeId, updateCustomerType)
    }

    @Delete(':id')
    @HttpCode(204)
    deleteCustomerType(@Param('id') idCustomerType){
        return this.customerTypeService.deleteCustomerType(idCustomerType)
    }
}
