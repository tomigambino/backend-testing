import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleEntity } from 'src/common/entities/sale';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('venta')
export class SaleController {

    constructor(private readonly saleService: SaleService){}

   @Post()
   async createSale(@Body() createSaleDto: CreateSaleDto): Promise<SaleEntity> {
       return this.saleService.createSale(createSaleDto);
   }

   @Get()
   async findSalesByPagination(@Query() paginationDto: PaginationDto): Promise<SaleEntity[]> {
       return this.saleService.findSalesByPagination(paginationDto);
   }
   
   @Get()
   async findSales(): Promise<SaleEntity[]> {
       return this.saleService.findSales();
   }

   @Get('count')
   async getSalesCount(): Promise<number> {
       return this.saleService.countSales();
   }

   @Get(':id')
   async findSaleById(@Param('id') id: number): Promise<SaleEntity> {
       return this.saleService.findSaleById(id);
   }

   @Patch(':id')
   async partialUpdateSale(@Param('id') id: number, @Body() updateSaleDto: UpdateSaleDto): Promise<SaleEntity> {
       return this.saleService.partialUpdateSale(id, updateSaleDto);
   }

   @Patch(':id/changeStatus')
   async changeStatus(@Param('id') id: number): Promise<SaleEntity> {
       return this.saleService.changeNextStatus(id);
   }

   @Delete(':id')
   @HttpCode(204)
   async deleteSale(@Param('id') id: number): Promise<void> {
       return this.saleService.deleteSale(id);
   }

}
