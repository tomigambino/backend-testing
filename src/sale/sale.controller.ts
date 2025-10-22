import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleEntity } from 'src/common/entities/sale';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedSales } from 'src/common/interfaces/paginatedSales-interface';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesDecorator } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/roles.enum';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('venta')
@UseGuards(AuthGuard)
export class SaleController {

    constructor(private readonly saleService: SaleService){}

    @Public()
    @Post()
    async createSale(@Body() createSaleDto: CreateSaleDto): Promise<SaleEntity> {
        return this.saleService.createSale(createSaleDto);
    }

    @Get()
    @RolesDecorator(Role.Owner || Role.Admin)
    async findSalesByPagination(@Query() paginationDto: PaginationDto): Promise<PaginatedSales> {
       return this.saleService.findSalesByPagination(paginationDto);
    }

   @Get()
   @RolesDecorator(Role.Owner || Role.Admin)
   async findSales(): Promise<SaleEntity[]> {
       return this.saleService.findSales();
   }

   @Get('count')
   @RolesDecorator(Role.Owner || Role.Admin)
   async getSalesCount(): Promise<number> {
       return this.saleService.countSales();
   }

   @Get(':id')
   @RolesDecorator(Role.Owner || Role.Admin)
   async findSaleById(@Param('id') id: number): Promise<SaleEntity> {
       return this.saleService.findSaleById(id);
   }

   @Patch(':id')
   @RolesDecorator(Role.Owner || Role.Admin)
   async partialUpdateSale(@Param('id') id: number, @Body() updateSaleDto: UpdateSaleDto): Promise<SaleEntity> {
       return this.saleService.partialUpdateSale(id, updateSaleDto);
   }

   @Patch(':id/changeStatus')
   @RolesDecorator(Role.Owner || Role.Admin)
   async changeStatus(@Param('id') id: number): Promise<SaleEntity> {
       return this.saleService.changeNextStatus(id);
   }

   @Delete(':id')
   @HttpCode(204)
   @RolesDecorator(Role.Owner || Role.Admin)
   async deleteSale(@Param('id') id: number): Promise<void> {
       return this.saleService.deleteSale(id);
   }

}
