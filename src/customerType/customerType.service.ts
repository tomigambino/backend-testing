import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerTypeDto } from './dto/create-customerType.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerTypeEntity } from 'src/common/entities/customerType';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerTypeService {

    constructor(
        @InjectRepository(CustomerTypeEntity) private customerTypeRepository: Repository<CustomerTypeEntity>
    ) {}

    async createCustomerType(createCustomerType: CreateCustomerTypeDto): Promise<CustomerTypeEntity> {
        const customerType = this.customerTypeRepository.create({
            name: createCustomerType.name,
        });
        await this.customerTypeRepository.save(customerType);
        return customerType;
    }

    async findAllCustomerType():Promise<CustomerTypeEntity[]>{
        return await this.customerTypeRepository.find()
    }

    async findCustomerTypeById(id: number): Promise<CustomerTypeEntity>{
        const customerType = await this.customerTypeRepository.findOne({where: {id: id}})
        if (!customerType){
            throw new NotFoundException(`Customer with ID ${id} not found`)
        }
        return customerType
    }

    async updateCustomerType(id: number, updateCustomerType): Promise<CustomerTypeEntity | null>{
        const customerType = await this.customerTypeRepository.findOne({where: {id:id}})
        if (!customerType){
            throw new NotFoundException("Customer Type Not Found")
        }
        await this.customerTypeRepository.update(id, updateCustomerType)
        return this.customerTypeRepository.findOne({where: {id:id}})
    }

    async deleteCustomerType(id: number) {
        // Si se borra el tipo de cliente, affected sera un number, caso contrario no lo sera
        const {affected} = await this.customerTypeRepository.delete(id)
        if( !affected ) {
            throw new NotFoundException("Customer Type Not Found");
        }
    }
}
