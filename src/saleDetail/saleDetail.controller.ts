import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { SaleDetailService } from './saleDetail.service';
import { CreateSaleDetailDto } from './dto/create-saleDetail.dto';
import { UpdateSaleDetailDto } from './dto/update-saleDetail.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesDecorator } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/roles.enum';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('detalleVenta')
@UseGuards(AuthGuard)
export class SaleDetailController {

    constructor(private saleDetailService: SaleDetailService) { }

    @Public()
    @Post()
    createSaleDetail(@Body() createSaleDetailDto: CreateSaleDetailDto) {
        return this.saleDetailService.createSaleDetail(createSaleDetailDto);
    }

    @Get()
    @RolesDecorator(Role.Owner || Role.Admin)
    getAllSaleDetails() {
        return this.saleDetailService.findAllSaleDetails();
    }

    @Get(':id')
    @RolesDecorator(Role.Owner || Role.Admin)
    getSaleDetail(@Param('id') saleDetailId: number) {
        return this.saleDetailService.findSaleDetailById(saleDetailId);
    }

    @Put(':id')
    @RolesDecorator(Role.Owner || Role.Admin)
    updateSaleDetail(@Param('id') saleDetailId: number, @Body() createSaleDetailDto: CreateSaleDetailDto) {
        return this.saleDetailService.updateSaleDetail(saleDetailId, createSaleDetailDto);
    }

    @Patch(':id')
    @RolesDecorator(Role.Owner || Role.Admin)
    partialUpdateSaleDetail(@Param('id') saleDetailId: number, @Body() updateSaleDetailDto: UpdateSaleDetailDto) {
        return this.saleDetailService.partialUpdateSaleDetail(saleDetailId, updateSaleDetailDto);
    }

    @Delete(':id')
    @HttpCode(204)
    @RolesDecorator(Role.Owner || Role.Admin)
    deleteSaleDetail(@Param('id') saleDetailId: number) {
        return this.saleDetailService.deleteSaleDetail(saleDetailId);
    }
}
