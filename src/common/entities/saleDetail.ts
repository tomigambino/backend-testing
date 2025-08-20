import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "./product.entity";
import { SaleEntity } from "./sale";

@Entity('detalle_venta')
export class SaleDetailEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => SaleEntity, (sale) => sale.saleDetail, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'venta' })
    sale: SaleEntity;

    @ManyToOne(() => ProductEntity)
    @JoinColumn({ name: 'producto' })
    product: ProductEntity;

    @Column({ name: 'cantidad' })
    quantity: number;

    @Column({ name: 'color' })
    color: string;

    @Column({ name: 'total_detalle' })
    totalDetail: number;
}