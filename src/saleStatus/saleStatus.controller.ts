import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { CreateSaleStateDto } from './dto/create-saleStatus.dto';
import { SaleStateService } from './saleStatus.service';

@Controller('estadoVenta')
export class SaleStateController {

    constructor(private saleStateService: SaleStateService) {  }
    
    @Post()
    createSaleState(@Body() saleState: CreateSaleStateDto){
        return this.saleStateService.createSaleState(saleState);
    }

    @Get()
    getAllSaleStates(){
        return this.saleStateService.findAllSaleStates();
    }

    @Get(':id')
    getSaleState(@Param('id') saleStateId){
        return this.saleStateService.findSaleStateById(saleStateId);
    }

    @Put(':id')
    updateSaleState(@Param('id') saleStateId, @Body() updateSaleState: CreateSaleStateDto){
        return this.saleStateService.updateSaleState(saleStateId, updateSaleState);
    }

    @Delete(':id')
    @HttpCode(204)
    deleteSaleState(@Param('id') saleStateId){
        return this.saleStateService.deleteSaleState(saleStateId);
    }

}
