import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductTypeEntity } from "./productType";
import { ImageEntity } from "./image.entity";

@Entity('producto')
export class ProductEntity extends BaseEntity{
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @ManyToOne(() => ProductTypeEntity)
    @JoinColumn({ name: 'tipo_producto' })
    productType: ProductTypeEntity;

    @OneToMany(() => ImageEntity, (image) => image.product)
    images: ImageEntity[];

    @Column({ name: 'nombre' })
    name: string;

    @Column({ name: 'descripcion' })
    description: string;

    @Column({ name: 'price' })
    price: number;

    @Column({ name: 'stock' })
    stock: number;

    @Column({ name: 'es_activo' })
    isActive: boolean;
}