import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleEntity } from 'src/common/entities/sale';
import { Repository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CustomerService } from 'src/customer/customer.service';
import { SaleDetailService } from 'src/saleDetail/saleDetail.service';
import { SaleDetailEntity } from 'src/common/entities/saleDetail';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SaleStateService } from 'src/saleStatus/saleStatus.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MPItem } from 'src/common/interfaces/MPItem-interface';
import { PayEntity } from 'src/common/entities/pay.entity';

@Injectable()
export class SaleService {

    constructor(
        @InjectRepository(SaleEntity) private saleRepository: Repository<SaleEntity>,
        private customerService: CustomerService,
        private saleDetailService: SaleDetailService,
        private saleStateService: SaleStateService
    ){ }

    async createSale(createSaleDto: CreateSaleDto): Promise<SaleEntity> {
        const customer = await this.customerService.findCustomerById(createSaleDto.customerId);

        const saleDetails: SaleDetailEntity[] = [] 
        for (const saleDetailId of createSaleDto.saleDetailIds) {
            const saleDetail = await this.saleDetailService.findSaleDetailById(saleDetailId);
            saleDetails.push(saleDetail);
        }

        const saleState = await this.saleStateService.findSaleStateByName('Pendiente');

        const newSale = this.saleRepository.create({
            saleDate: new Date(),
            customer: customer,
            saleDetail: saleDetails,
            total: this.calculateTotalSale(saleDetails),
            saleStatus: saleState,
        });

        await this.saleRepository.save(newSale);
        return newSale;
    }

    async asignPaymentToSale(saleId: number, pay: PayEntity): Promise<SaleEntity> {
        const sale = await this.findSaleById(saleId);
        sale.pay = pay;
        await this.saleRepository.save(sale);
        return sale;
    }

    async findSales(): Promise<SaleEntity[]> {
        return this.saleRepository.find({
            relations: ['customer', 'saleDetail', 'saleStatus']
        });
    }

    async findSalesByPagination(paginationDto: PaginationDto): Promise<SaleEntity[]> {
        const { page, limit } = paginationDto;
        return this.saleRepository.find({
            relations: ['customer', 'saleDetail', 'saleDetail.product', 'saleStatus'],
            order: { saleDate: 'DESC' },
            skip: (page - 1) * limit,
            take: limit
        });
    }

    async findSaleById(saleId: number): Promise<SaleEntity> {
        const sale = await this.saleRepository.findOne({
            where: { id: saleId },
            relations: ['customer', 'saleDetail', 'saleDetail.product', 'saleStatus']
        });

        if (!sale) {
            throw new NotFoundException("Sale Not Found");
        }

        return sale;
    }

    async findItemsSaleById(saleId: number): Promise<MPItem[]> {
        const sale = await this.findSaleById(saleId)

        const items = sale.saleDetail.map(detail => ({
            id: detail.id.toString(),
            title: detail.product.name,
            quantity: detail.quantity,
            unit_price: detail.product.price
            }));
        return items
    }

    async partialUpdateSale(saleId: number, updateSaleDto: UpdateSaleDto): Promise<SaleEntity> {
        const sale = await this.findSaleById(saleId);

        // Buscamos el cliente asociado si se proporciona su id
        if (updateSaleDto.customerId) {
            const customer = await this.customerService.findCustomerById(updateSaleDto.customerId);
            sale.customer = customer;
        }

        // Buscamos los detalles de venta asociados si se proporciona sus ids
        if (updateSaleDto.saleDetailIds) {
            const saleDetails: SaleDetailEntity[] = [];
            for (const saleDetailId of updateSaleDto.saleDetailIds) {
                const saleDetail = await this.saleDetailService.findSaleDetailById(saleDetailId);
                saleDetails.push(saleDetail);
            }
            sale.saleDetail = saleDetails;
        }

        Object.assign(sale, updateSaleDto);
        await this.saleRepository.save(sale);
        return sale;
    
    }

    async deleteSale(id: number) {
            // Si se borra el producto, affected sera un number, caso contrario no lo sera
            const {affected} = await this.saleRepository.delete(id)
            if( !affected ) {
                throw new NotFoundException("Sale Not Found");
            }
        }

    async changeNextStatus(saleId: number): Promise<SaleEntity> {
        const sale = await this.findSaleById(saleId);
        const nextStatus = await this.saleStateService.getNextSaleStatus(sale.saleStatus);

        sale.saleStatus = nextStatus;
        await this.saleRepository.save(sale);
        return sale;
    }

    async updateSalePaymentStatus(saleId: number, status: string): Promise<SaleEntity> {
        const sale = await this.findSaleById(saleId);
        const saleStatusUpdated = await this.saleStateService.findStatusByMPStatus(status);
        sale.saleStatus = saleStatusUpdated;
        await this.saleRepository.save(sale);
        return sale;
    }

    calculateTotalSale(saleDetails: SaleDetailEntity[]): number {
        return saleDetails.reduce((total, detail) => total + detail.totalDetail, 0);
    }

    async countSales(): Promise<number> {
        return this.saleRepository.count();
    }
}
