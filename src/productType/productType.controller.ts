import { Body, Controller, Param, Post, Delete, Get, Patch, HttpCode, UseGuards } from '@nestjs/common';
import { CreateProductTypeDto } from './dto/create-productType.dto';
import { ProductTypeService } from './productType.service';
import { PatchProductTypeDto } from './dto/patch-productType.dto';
import { RolesDecorator } from 'src/common/roles.decorator';
import { Role } from 'src/common/roles.enum';
import { AuthGuard } from 'src/auth/auth.guard';


@Controller('tipoProducto')
@UseGuards(AuthGuard)
export class ProductTypeController {

    constructor(private productTypeService: ProductTypeService) {  }

    @RolesDecorator(Role.Owner || Role.Admin)
    @Post()
    createProductType(@Body() productType: CreateProductTypeDto){
        return this.productTypeService.createProductType(productType) 
    }

    @Get()
    getAllProductType(){
        return this.productTypeService.findAllProductType();
    }

    @Get(':id')
    getProductType(@Param('id') idProductType){
        return this.productTypeService.findProductTypeById(idProductType);
    }

    @RolesDecorator(Role.Owner || Role.Admin)
    @Patch(':id')
    patchProductType(@Param('id') productTypeId, @Body() updateProductType: PatchProductTypeDto){
        return this.productTypeService.partialUpdateProductType(productTypeId, updateProductType)
    }

    @Delete(':id')
    @HttpCode(204)
    @RolesDecorator(Role.Owner || Role.Admin)
    deleteProductType(@Param('id') idProductType){
        return this.productTypeService.deleteProductType(idProductType)
    }
}
