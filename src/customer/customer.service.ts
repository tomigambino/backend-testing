import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/common/entities/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { PatchCustomerDto } from './dto/patch-customer.dto';
import { CustomerTypeService } from 'src/customerType/customerType.service';

@Injectable()
export class CustomerService {

    constructor(
        @InjectRepository(CustomerEntity) private customerRepository: Repository<CustomerEntity>,
        private customerTypeService: CustomerTypeService
    ){}

    async createCustomer(createCustomerDto: CreateCustomerDto): Promise<CustomerEntity>{
        const { customerTypeId } = createCustomerDto;

        const customerType = await this.customerTypeService.findCustomerTypeById(customerTypeId);

        const newCustomer = this.customerRepository.create({
            customerType: customerType,
            firstName: createCustomerDto.firstName,
            lastName: createCustomerDto.lastName,
            phone: createCustomerDto.phone,
            email: createCustomerDto.email,
            registrationDate: new Date()
        })

        await this.customerRepository.save(newCustomer);
        return newCustomer;
    }

    async findAllCustomers(): Promise<CustomerEntity[]> {
        return this.customerRepository.find({
            relations: ['customerType']
        });
    }

    async findCustomerById(id: number): Promise<CustomerEntity> {
        const customer = await this.customerRepository.findOne({
            where: { id: id },
            relations: ['customerType']
        });

        if (!customer) {
            throw new NotFoundException(`Customer with ID ${id} not found`);
        }

        return customer;
    }

    async updateCustomer(id: number, updateCustomerDto: CreateCustomerDto): Promise<CustomerEntity> {
        const customer = await this.findCustomerById(id);

        const { customerTypeId } = updateCustomerDto;

        if (!customerTypeId) {
            throw new BadRequestException('The customer type ID is required')
        }

        const customerType = await this.customerTypeService.findCustomerTypeById(customerTypeId);
        customer.customerType = customerType;
        customer.firstName = updateCustomerDto.firstName;
        customer.lastName = updateCustomerDto.lastName;
        customer.phone = updateCustomerDto.phone;
        customer.email = updateCustomerDto.email;

        await this.customerRepository.save(customer);
        return customer;
    }

    async partialUpdateCustomer(id: number, updateCustomerDto: PatchCustomerDto): Promise<CustomerEntity> {
        const customer = await this.findCustomerById(id);
        if (!customer) {
            throw new NotFoundException("Customer Not Found");
        }

        const { customerTypeId } = updateCustomerDto;

        if (customerTypeId) {
            const customerType = await this.customerTypeService.findCustomerTypeById(customerTypeId);
            customer.customerType = customerType;
        }

        // Actualizamos en customer solo los campos que vienen en el dto.
        Object.assign(customer, updateCustomerDto);

        await this.customerRepository.save(customer);
        return customer;
    }

    async deleteCustomer(id: number): Promise<void> {
        // Si se borra el tipo de cliente, affected sera un number, caso contrario no lo sera
        const {affected} = await this.customerRepository.delete(id)
        if( !affected ) {
            throw new NotFoundException("Customer Not Found");
        }
    }

}
