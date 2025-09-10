import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "./product.entity";

@Entity('imagenes')
export class ImageEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => ProductEntity, (product) => product.images, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'producto_id'})
    product: ProductEntity;

    @Column({name: 'url'})
    url: string

    @Column({name: 'nombre_archivo'})
    name: string

    @Column({name: 'tamaño'})
    size: string
    
}