import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleDetailEntity } from 'src/common/entities/saleDetail';
import { ProductService } from 'src/product/product.service';
import { Repository } from 'typeorm';
import { CreateSaleDetailDto } from './dto/create-saleDetail.dto';
import { UpdateSaleDetailDto } from './dto/update-saleDetail.dto';


@Injectable()
export class SaleDetailService {

    constructor(
        @InjectRepository(SaleDetailEntity) private saleDetailRepository: Repository<SaleDetailEntity>,
        private productService: ProductService,
    ) { }

    async createSaleDetail(createSaleDetailDto: CreateSaleDetailDto): Promise<SaleDetailEntity> {
        const { productId } = createSaleDetailDto;

        const product = await this.productService.findProductById(productId);

        // Calculamos el total del detalle de venta
        const detailTotal = this.calculateTotalSaleDetail(createSaleDetailDto.quantity, product.price);

        const newSaleDetail = this.saleDetailRepository.create({
            product: product,
            quantity: createSaleDetailDto.quantity,
            totalDetail: detailTotal
        });

        await this.saleDetailRepository.save(newSaleDetail);
        return newSaleDetail;
    }

    async findAllSaleDetails(): Promise<SaleDetailEntity[]> {
        return this.saleDetailRepository.find({
            relations: ['product'],
        });
    }

    async findSaleDetailById(id: number): Promise<SaleDetailEntity> {
        const saleDetail = await this.saleDetailRepository.findOne({
            where: { id },
            relations: ['product'],
        });

        if (!saleDetail) {
            throw new NotFoundException("Sale Detail Not Found");
        }

        return saleDetail;
    }

    async updateSaleDetail(id: number, createSaleDetailDto: CreateSaleDetailDto): Promise<SaleDetailEntity> {
        const saleDetail = await this.findSaleDetailById(id);
        const { productId } = createSaleDetailDto;

        // Buscamos el producto por su ID y lo asignamos al detalle de venta
        const product = await this.productService.findProductById(productId);
        saleDetail.product = product;

        // Calculamos el total del detalle y lo asignamos
        saleDetail.totalDetail = this.calculateTotalSaleDetail(createSaleDetailDto.quantity, product.price);

        Object.assign(saleDetail, createSaleDetailDto)

        await this.saleDetailRepository.save(saleDetail);
        return saleDetail;
    }

    async partialUpdateSaleDetail(id: number, updateSaleDetailDto: UpdateSaleDetailDto): Promise<SaleDetailEntity> {
        let updateTotal = false;
        const saleDetail = await this.findSaleDetailById(id);

        if (updateSaleDetailDto.productId) {
            const product = await this.productService.findProductById(updateSaleDetailDto.productId);
            saleDetail.product = product;
            updateTotal = true; // Si se actualiza el producto, recalculamos el total
        }

        if (updateSaleDetailDto.quantity) {
            saleDetail.quantity = updateSaleDetailDto.quantity;
            updateTotal = true; // Si se actualiza la cantidad, recalculamos el total
        }

        // Calculamos el total del detalle
        if (updateTotal) {
            const detailTotal = this.calculateTotalSaleDetail(saleDetail.quantity, saleDetail.product.price);
            saleDetail.totalDetail = detailTotal;
        }

        await this.saleDetailRepository.save(saleDetail);
        return saleDetail;
    }

    async deleteSaleDetail(id: number) {
        // Si se borra el producto, affected sera un number, caso contrario no lo sera
        const {affected} = await this.saleDetailRepository.delete(id)
        if( !affected ) {
            throw new NotFoundException("Sale Detail Not Found");
        }
    }

    calculateTotalSaleDetail(quantity:number, productPrice:number): number {
        if (quantity <= 0 || productPrice <= 0) {
            throw new Error('Quantity and product price must be positive numbers.');
        }
        return quantity * productPrice;
    }
}
