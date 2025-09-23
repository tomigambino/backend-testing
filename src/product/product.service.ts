import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/common/entities/product.entity';
import { Repository } from 'typeorm';
import { ProductTypeService } from 'src/productType/productType.service';
import { PatchProductDto } from './dto/patch-product.dto';

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
            relations: ['productType', 'images'],
        });
    }

    async findAllProductsByProductType(productTypeId: number) {
        const products = await this.productRepository.find({
            where: { productType: {id: productTypeId} },
            relations: ['productType', 'images'],
        });

        if (!products || products.length === 0) {
            throw new NotFoundException( `Not found products for this product type ${productTypeId}`);
        }

        return products;
    }

    async findProductsByIds(idsParam: string): Promise<ProductEntity[]>{
        // Validamos que el parametro no esté vacío
        if (!idsParam || idsParam == '') {
            throw new BadRequestException('IDs de productos requeridos');
        }

        // Convertimos el string en array de numbers [1, 2, 3, 4]
        const productIds = idsParam.split(',').map(id => parseInt(id.trim(), 10))


        // Buscamos los productos por sus IDs
        const productPromises = productIds.map(id => this.findProductById(id));
        const results = await Promise.all(productPromises);

        // Verificamos que quedó al menos un ID válido
        if (results.length === 0) {
            throw new BadRequestException('No se encontraron IDs válidos');
        }
    
        return results
    }

    async partialUpdateProduct(id: number, updateProductDto: PatchProductDto) {
        const product = await this.findProductById(id);

        if (updateProductDto.productTypeId) {
            const productType = await this.productTypeService.findProductTypeById(updateProductDto.productTypeId);
            product.productType = productType;
        }

        Object.assign(product, updateProductDto);

        return await this.productRepository.save(product);
    }

    async deleteProduct(id: number) {
        // Si se borra el producto, affected sera un number, caso contrario no lo sera
        const {affected} = await this.productRepository.delete(id)
        if( !affected ) {
            throw new NotFoundException("Product Not Found");
        }
    }
}
