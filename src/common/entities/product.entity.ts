import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductTypeEntity } from "./productType";

@Entity('producto')
export class ProductEntity extends BaseEntity{
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @ManyToOne(() => ProductTypeEntity)
    @JoinColumn({ name: 'tipo_producto' })
    productType: ProductTypeEntity;

    @Column({ name: 'nombre' })
    name: string;

    @Column({ name: 'descripcion' })
    description: string;

    @Column()
    price: number;

    @Column()
    stock: number;

    @Column()
    isActive: boolean;
}