import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { PatchProductDto } from './dto/patch-product.dto';
import { ParseIntPipe } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesDecorator } from 'src/common/roles.decorator';
import { Role } from 'src/common/roles.enum';

@Controller('producto')
@UseGuards(AuthGuard)
export class ProductController {

    constructor(private readonly productService: ProductService) {}
    
    @RolesDecorator(Role.Owner || Role.Admin)
    @Post()
    createProduct(@Body() createProductDto: CreateProductDto) {
        return this.productService.createProduct(createProductDto);
    }

    @Get('carrito')  // GET /producto/carrito?ids=1,2,3
    async getProductsForCart(@Query('ids') idsParam: string) {
        return this.productService.findProductsByIds(idsParam);
    }

    @Get(':id')
    getProduct(@Param('id') productId: number) {
        return this.productService.findProductById(productId);
    }

    @Get()
    getProductsByPagination(@Query() paginationDto: PaginationDto) {
        return this.productService.findProductsByPagination(paginationDto);
    }

    @Get()
    getAllProducts() {
        return this.productService.findAllProducts();
    }

    @Get('tipo/:productTypeId')
    async findAllByProductType(
        @Param('productTypeId', ParseIntPipe) productTypeId: number,
        @Query() paginationDto: PaginationDto
    ) {
        return this.productService.findAllProductsByProductType(productTypeId, paginationDto);
    }

    @Patch(':id')
    @RolesDecorator(Role.Owner || Role.Admin)
    patchProduct(@Param('id') id: number, @Body() updateProductDto: PatchProductDto) {
        return this.productService.partialUpdateProduct(id, updateProductDto);
    }

    @Delete(':id')
    @HttpCode(204)
    @RolesDecorator(Role.Owner || Role.Admin)
    deleteProduct(@Param('id') id: number) {
        return this.productService.deleteProduct(id);
    }

}
