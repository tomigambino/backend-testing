import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerEntity } from 'src/common/entities/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { PatchCustomerDto } from './dto/patch-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CustomerService {

    constructor(
        @InjectRepository(CustomerEntity) private customerRepository: Repository<CustomerEntity>,
    ){}

    async createCustomer(createCustomerDto: CreateCustomerDto, hashedPassword: string): Promise<CustomerEntity>{
        const newCustomer = this.customerRepository.create({
            firstName: createCustomerDto.firstName,
            lastName: createCustomerDto.lastName,
            phone: createCustomerDto.phone,
            email: createCustomerDto.email,
            password: hashedPassword,
            registrationDate: new Date()
        })

        await this.customerRepository.save(newCustomer);
        return newCustomer;
    }

    async findAllCustomers(): Promise<CustomerEntity[]> {
        return this.customerRepository.find();
    }

    async findCustomerById(id: number): Promise<CustomerEntity> {
        const customer = await this.customerRepository.findOne({
            where: { id: id },
        });

        if (!customer) {
            throw new NotFoundException(`Customer with ID ${id} not found`);
        }

        return customer;
    }

    async findCustomerByEmail(email: string): Promise<CustomerEntity> {
        const customer = await this.customerRepository.findOne({
            where: { email: email },
        });

        if (!customer) {
            throw new NotFoundException(`Customer with email ${email} not found`);
        }

        return customer;
    }

    async existsByEmail(email: string): Promise<boolean> {
        const customer = await this.customerRepository.findOne({
            where: { email: email },
        });

        return !!customer;
    }

    async updateCustomer(id: number, updateCustomerDto: UpdateCustomerDto): Promise<CustomerEntity> {
        const customer = await this.findCustomerById(id);
        
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
