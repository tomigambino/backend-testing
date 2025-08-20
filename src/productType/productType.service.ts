import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductTypeDto } from './dto/create-productType.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductTypeEntity } from 'src/common/entities/productType';
import { Repository } from 'typeorm';
import { PatchProductTypeDto } from './dto/patch-productType.dto';

@Injectable()
export class ProductTypeService {

    constructor(
        @InjectRepository(ProductTypeEntity) private productTypeRepository: Repository<ProductTypeEntity>
    ) {}

    async createProductType(createProductType: CreateProductTypeDto): Promise<ProductTypeEntity> {
        const productType = this.productTypeRepository.create({
            name: createProductType.name,
        });
        await this.productTypeRepository.save(productType);
        return productType;
    }

    async findAllProductType(): Promise<ProductTypeEntity[]> {
        return await this.productTypeRepository.find();
    }

    async findProductTypeById(id: number): Promise<ProductTypeEntity>{
        const productType = await this.productTypeRepository.findOne({where: {id: id}})
        if (!productType){
            throw new NotFoundException(`Product Type with ID ${id} not found`);
        }
        return productType;
    }

    async partialUpdateProductType(id: number, updateProductType: PatchProductTypeDto): Promise<ProductTypeEntity | null>{
        const productType = await this.productTypeRepository.findOne({where: {id:id}})
        if (!productType){
            throw new NotFoundException("Product Type Not Found")
        }
        await this.productTypeRepository.update(id, updateProductType)
        return this.productTypeRepository.findOne({where: {id:id}})
    }

    async deleteProductType(id: number) {
        // Si se borra el tipo de producto, affected sera un number, caso contrario no lo sera
        const {affected} = await this.productTypeRepository.delete(id)
        if( !affected ) {
            throw new NotFoundException("Product Type Not Found");
        }
    }
}
