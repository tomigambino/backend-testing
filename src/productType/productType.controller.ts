import { Body, Controller, Param, Post, Delete, Get, Patch, HttpCode } from '@nestjs/common';
import { CreateProductTypeDto } from './dto/create-productType.dto';
import { ProductTypeService } from './productType.service';
import { PatchProductTypeDto } from './dto/patch-productType.dto';

@Controller('tipoProducto')
export class ProductTypeController {

    constructor(private productTypeService: ProductTypeService) {  }

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

    @Patch(':id')
    patchProductType(@Param('id') productTypeId, @Body() updateProductType: PatchProductTypeDto){
        return this.productTypeService.partialUpdateProductType(productTypeId, updateProductType)
    }

    @Delete(':id')
    @HttpCode(204)
    deleteProductType(@Param('id') idProductType){
        return this.productTypeService.deleteProductType(idProductType)
    }
}
