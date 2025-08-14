import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleStatusEntity } from 'src/common/entities/saleStatus';
import { Repository } from 'typeorm';
import { CreateSaleStateDto } from './dto/create-saleStatus.dto';

@Injectable()
export class SaleStateService {

    constructor(
        @InjectRepository(SaleStatusEntity) private saleStateEntity: Repository<SaleStatusEntity>
    ){}

    async createSaleState(createSaleStateDto: CreateSaleStateDto): Promise<SaleStatusEntity> {
        const saleState = this.saleStateEntity.create({
            value: createSaleStateDto.value,
        });
        await this.saleStateEntity.save(saleState);
        return saleState;
    }

    async findAllSaleStates(): Promise<SaleStatusEntity[]> {
        return await this.saleStateEntity.find();
    }

    async findSaleStateById(id: number): Promise<SaleStatusEntity> {
        const saleState = await this.saleStateEntity.findOne({ where: { id: id } });
        if (!saleState) {
            throw new NotFoundException(`Sale State with ID ${id} not found`);
        }
        return saleState;
    }

    async findSaleStateByName(name: string): Promise<SaleStatusEntity> {
        const saleState = await this.saleStateEntity.findOne({ where: { value: name } });
        if (!saleState) {
            throw new NotFoundException(`Sale State with name ${name} not found`);
        }
        return saleState;
    }

    async updateSaleState(id: number, updateSaleStateDto: CreateSaleStateDto): Promise<SaleStatusEntity | null> {
        const saleState = await this.saleStateEntity.findOne({ where: { id: id } });
        if (!saleState) {
            throw new NotFoundException("Sale State Not Found");
        }
        await this.saleStateEntity.update(id, updateSaleStateDto);
        return this.saleStateEntity.findOne({ where: { id: id } });
        }

    async deleteSaleState(id: number) {
        const { affected } = await this.saleStateEntity.delete(id);
        if (!affected) {
            throw new NotFoundException("Sale State Not Found");
        }
    }

    async getNextSaleStatus(status: SaleStatusEntity): Promise<SaleStatusEntity>{
        switch (status.value) {
            case 'Pendiente':
                return this.findSaleStateByName('En Proceso');
            case 'En Proceso':
                return this.findSaleStateByName('Producto Listo');
            case 'Producto Listo':
                return this.findSaleStateByName('Finalizada');
            case 'Finalizada':
                return this.findSaleStateByName('Cancelada');
            case 'Cancelada':
                return this.findSaleStateByName('Pendiente');
            default:
                throw new Error('Estado no valido');
        }
    }
}

        
    
