import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../roles.enum";

@Entity('cliente')
export class CustomerEntity extends BaseEntity{

    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'correo_electronico', nullable: false })
    email: string;

    @Column({ name: 'contraseña', nullable: false })
    password: string;

    @Column({ name: 'nombre' })
    firstName: string;

    @Column({ name: 'apellido', nullable: true })
    lastName: string;

    @Column({ name: 'telefono', nullable: true })
    phone: string;

    @Column({ name: 'fecha_alta', type: 'date' })
    registrationDate: Date;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.User, // valor por defecto
    })
    role: Role;

    @Column({ type: 'int', default: 0 })
    failedLoginAttempts: number;
    
    @Column({ type: 'timestamp', nullable: true })
    lockedUntil: Date | null;
    
    @Column({ type: 'timestamp', nullable: true })
    lastFailedLoginAt: Date | null;
}