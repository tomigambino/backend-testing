import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tipo_producto')
export class ProductTypeEntity extends BaseEntity{
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'nombre' })
    name: string;

    @Column({ name: 'descripcion' })
    description: string;
}