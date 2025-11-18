import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/common/entities/product.entity';
import { Repository } from 'typeorm';
import { ProductTypeService } from 'src/productType/productType.service';
import { PatchProductDto } from './dto/patch-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
        private productTypeService: ProductTypeService,
        private imagesService: ImagesService,
    ) { }

    async createProduct(createProductDto: CreateProductDto, images: Express.Multer.File[]) {
        const productType = await this.productTypeService.findProductTypeById(createProductDto.productTypeId);

        // Creamos el producto
        const product = this.productRepository.create({
            productType: productType,
            name: createProductDto.name,
            description: createProductDto.description,
            price: createProductDto.price,
            stock: createProductDto.stock,
            isActive: createProductDto.isActive
        });

        // Validamos que las imagenes sean validas. En caso de no serlo, lanza una excepción
        await this.imagesService.validateFiles(images);

        // Guardamos el producto primero
        const savedProduct = await this.productRepository.save(product);

        // Subimos las imágenes
        await this.imagesService.uploadMultipleImages(images, savedProduct.id);

        return savedProduct;
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

    async partialUpdateProduct(
        id: number, 
        updateProductDto: PatchProductDto, 
        images?: Express.Multer.File[]
    ): Promise<ProductEntity> {
        const product = await this.findProductById(id);

        // Actualizamos el tipo de producto si viene en el DTO
        if (updateProductDto.productTypeId) {
            const productType = await this.productTypeService.findProductTypeById(updateProductDto.productTypeId);
            product.productType = productType;
        }

        // Aplicar los cambios del DTO
        Object.assign(product, updateProductDto);

        // Guardamos el producto actualizado
        const savedProduct = await this.productRepository.save(product);

        // Si se enviaron nuevas imágenes, las subimos (no contemplamos eliminación de imágenes viejas por ahora)
        if (images && images.length > 0) {
            try {
                await this.imagesService.validateFiles(images);
                await this.imagesService.uploadMultipleImages(images, savedProduct.id);
            } catch (error) {
                // Si falla la subida de imágenes, no revertimos el producto
                // porque ya estaba creado
                throw new BadRequestException('Error al subir las imágenes');
            }
        }

        return savedProduct;
    }

    async deleteProduct(id: number) {
    const { affected } = await this.productRepository.update(id, { isActive: false });
    if (!affected) {
        throw new NotFoundException("Product Not Found");
    }
    }
}
