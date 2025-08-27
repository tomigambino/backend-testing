import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('cliente')
export class CustomerEntity extends BaseEntity{
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'nombre' })
    firstName: string;

    @Column({ name: 'apellido', nullable: true })
    lastName: string;

    @Column({ name: 'telefono', nullable: true })
    phone: string;

    @Column({ name: 'correo_electronico', nullable: false })
    email: string;

    @Column({ name: 'contraseña', nullable: false })
    password: string;

    @Column({ name: 'fecha_alta', type: 'date' })
    registrationDate: Date;
}