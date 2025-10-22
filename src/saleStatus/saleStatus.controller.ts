import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateSaleStateDto } from './dto/create-saleStatus.dto';
import { SaleStateService } from './saleStatus.service';
import { Role } from 'src/common/roles.enum';
import { RolesDecorator } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('estadoVenta')
@UseGuards(AuthGuard)
export class SaleStateController {

    constructor(private saleStateService: SaleStateService) {  }
    
    @Post()
    @RolesDecorator(Role.Admin)
    createSaleState(@Body() saleState: CreateSaleStateDto){
        return this.saleStateService.createSaleState(saleState);
    }

    @Get()
    @RolesDecorator(Role.Admin)
    getAllSaleStates(){
        return this.saleStateService.findAllSaleStates();
    }

    @RolesDecorator(Role.Admin)
    @Get(':id')
    getSaleState(@Param('id') saleStateId){
        return this.saleStateService.findSaleStateById(saleStateId);
    }

    @Put(':id')
    @RolesDecorator(Role.Admin)
    updateSaleState(@Param('id') saleStateId, @Body() updateSaleState: CreateSaleStateDto){
        return this.saleStateService.updateSaleState(saleStateId, updateSaleState);
    }

    @Delete(':id')
    @HttpCode(204)
    @RolesDecorator(Role.Admin)
    deleteSaleState(@Param('id') saleStateId){
        return this.saleStateService.deleteSaleState(saleStateId);
    }

}
