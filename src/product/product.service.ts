import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/common/entities/product.entity';
import { Repository } from 'typeorm';
import { ProductTypeService } from 'src/productType/productType.service';
import { PatchProductDto } from './dto/patch-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
        private productTypeService: ProductTypeService,
    ) { }

    async createProduct(createProductDto: CreateProductDto) {
        const productType = await this.productTypeService.findProductTypeById(createProductDto.productTypeId)

            // Creamos y guardamos el producto con los datos del DTO y las entidades de archivos, tipo de producto e insumos
            const product = await this.productRepository.create({
            productType: productType,
            name: createProductDto.name,
            description: createProductDto.description,
            price: createProductDto.price,
            stock: createProductDto.stock,
            isActive: createProductDto.isActive
            })

            return await this.productRepository.save(product);
    }

    async findProductById(id: number) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['productType', 'images'],
        });

        if (!product) {
            throw new NotFoundException(`Producto con ID ${id} no encontrado`);
        }

        return product;
    }

    async findAllProducts() {
        return await this.productRepository.find({
            where: { isActive: true },
            relations: ['productType', 'images'],
        });
    }

    async findProductsByPagination(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        const [data, total] = await this.productRepository.findAndCount({
            where: { isActive: true },
            relations: ['productType', 'images'],
            order: { id: 'ASC' },
            skip: (page - 1) * limit,
            take: limit
        });
        return { data, total, page, limit };
    }
    
    async findAllProductsByProductType(productTypeId: number, paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        await this.productTypeService.findProductTypeById(productTypeId); // Verifica si el tipo de producto existe
        const [data, total] = await this.productRepository.findAndCount({
            where: { productType: { id: productTypeId }, isActive: true },
            relations: ['productType', 'images'],
            order: { id: 'ASC' },
            skip: (page - 1) * limit,
            take: limit
        });
        return { data, total, page, limit };
        // En caso de que no haya ningún producto, data será un array vacío y total será 0
    }

    async findProductsByIds(idsParam: string): Promise<ProductEntity[]>{
        // Los idsParam vienen en formato string "1,2,3,4"
        // Validamos que el parametro no esté vacío
        if (!idsParam || idsParam == '') {
            throw new BadRequestException('IDs de productos requeridos');
        }

        // Convertimos el string en array de numbers [1, 2, 3, 4]
        const productIds = idsParam.split(',').map(id => parseInt(id.trim(), 10))

        // Buscamos los productos por sus IDs
        const productPromises = productIds.map(id => this.findProductById(id));
        const results = await Promise.all(productPromises);
    
        return results
    }

    async partialUpdateProduct(id: number, updateProductDto: PatchProductDto): Promise<ProductEntity> {
        const product = await this.findProductById(id);

        if (updateProductDto.productTypeId) {
            const productType = await this.productTypeService.findProductTypeById(updateProductDto.productTypeId);
            product.productType = productType;
        }

        Object.assign(product, updateProductDto);

        return await this.productRepository.save(product);
    }

    async deleteProduct(id: number) {
    const { affected } = await this.productRepository.update(id, { isActive: false });
    if (!affected) {
        throw new NotFoundException("Product Not Found");
    }
    }
}
