import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CustomerTypeEntity } from "./customerType";

@Entity('cliente')
export class CustomerEntity extends BaseEntity{
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @ManyToOne(() => CustomerTypeEntity)
    @JoinColumn({ name: 'tipo_cliente' })
    customerType: CustomerTypeEntity;

    @Column({ name: 'nombre' })
    firstName: string;

    @Column({ name: 'apellido', nullable: true })
    lastName: string;

    @Column({ name: 'telefono', nullable: true })
    phone: string;

    @Column({ name: 'correo_electronico', nullable: true })
    email: string;

    @Column({ name: 'fecha_alta', type: 'date' })
    registrationDate: Date;
}