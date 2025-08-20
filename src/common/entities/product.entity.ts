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

    @Column({ name: 'horas_impresion' })
    printDuration: number;

    @Column({ name: 'peso' })
    weight: number;

    @Column()
    publishedPrice: number;

    @Column()
    isActive: boolean;
}