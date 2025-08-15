import { PrimaryGeneratedColumn, Column, BaseEntity, Entity } from "typeorm";

@Entity('estado_venta')
export class SaleStatusEntity extends BaseEntity{
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'valor' })
    value: string;
}