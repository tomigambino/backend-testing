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
        return await this.saleStateEntity.save(saleState);
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

    async updateSaleState(id: number, updateSaleStateDto: CreateSaleStateDto): Promise<SaleStatusEntity> {
        await this.findSaleStateById(id); // Comprobamos que exista un estado con ese id
        await this.saleStateEntity.update(id, updateSaleStateDto);
        return this.findSaleStateById(id);
    }

    async deleteSaleState(id: number) {
        const { affected } = await this.saleStateEntity.delete(id);
        if (!affected) {
            throw new NotFoundException("Sale State Not Found");
        }
    }

    async findStatusByMPStatus(mpStatus: string){
        const status = mpStatus.toLowerCase();

        let saleStatusName: string;

        switch (status) {
            case 'approved':
            saleStatusName = 'Aprobado';
            break;
            case 'pending':
            case 'authorized':
            case 'in_process':
            saleStatusName = 'Pendiente';
            break;
            case 'rejected':
            saleStatusName = 'Rechazado';
            break;
            case 'refunded':
            case 'charged_back':
            saleStatusName = 'Devuelto';
            break;
            case 'cancelled':
            saleStatusName = 'Cancelado';
            break;
            default:
            throw new Error(`Estado de MP no reconocido: ${mpStatus}`);
        }

        // Buscamos el estado en la tabla de estados de venta
        const saleStatus = await this.saleStateEntity.findOne({
            where: { value: saleStatusName }
        });

        if(!saleStatus){
            throw new NotFoundException(`Estado de venta no encontrado: ${saleStatusName}`);
        }
        return saleStatus;
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

        
    
