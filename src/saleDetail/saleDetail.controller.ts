import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put } from '@nestjs/common';
import { SaleDetailService } from './saleDetail.service';
import { CreateSaleDetailDto } from './dto/create-saleDetail.dto';
import { UpdateSaleDetailDto } from './dto/update-saleDetail.dto';


@Controller('detalleVenta')
export class SaleDetailController {

    constructor(private saleDetailService: SaleDetailService) { }

    @Post()
    createSaleDetail(@Body() createSaleDetailDto: CreateSaleDetailDto) {
        return this.saleDetailService.createSaleDetail(createSaleDetailDto);
    }

    @Get()
    getAllSaleDetails() {
        return this.saleDetailService.findAllSaleDetails();
    }

    @Get(':id')
    getSaleDetail(@Param('id') saleDetailId: number) {
        return this.saleDetailService.findSaleDetailById(saleDetailId);
    }

    @Put(':id')
    updateSaleDetail(@Param('id') saleDetailId: number, @Body() createSaleDetailDto: CreateSaleDetailDto) {
        return this.saleDetailService.updateSaleDetail(saleDetailId, createSaleDetailDto);
    }

    @Patch(':id')
    partialUpdateSaleDetail(@Param('id') saleDetailId: number, @Body() updateSaleDetailDto: UpdateSaleDetailDto) {
        return this.saleDetailService.partialUpdateSaleDetail(saleDetailId, updateSaleDetailDto);
    }

    @Delete(':id')
    @HttpCode(204)
    deleteSaleDetail(@Param('id') saleDetailId: number) {
        return this.saleDetailService.deleteSaleDetail(saleDetailId);
    }
}
