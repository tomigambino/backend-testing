import { PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany, JoinColumn, Entity, OneToOne } from "typeorm";
import { CustomerEntity } from "./customer.entity";
import { SaleStatusEntity } from "./saleStatus";
import { SaleDetailEntity } from "./saleDetail";
import { PayEntity } from "./pay.entity";

@Entity('venta')
export class SaleEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date', name: 'fecha_venta' })
    saleDate: Date;

    @ManyToOne(() => CustomerEntity)
    @JoinColumn({ name: 'cliente_id' })
    customer: CustomerEntity;

    @OneToMany(() => SaleDetailEntity, (saleDetail) => saleDetail.sale)
    @JoinColumn({ name: 'detalle_venta_id' })
    saleDetail: SaleDetailEntity[];

    @OneToOne(() => PayEntity, (pay) => pay.sale)
    @JoinColumn({ name: 'pago_id' })
    pay: PayEntity;

    @Column({ name: 'seña' })
    deposit: number;

    @Column({ name: 'total' })
    total: number;

    @Column({ name: 'descuento_aplicado' })
    appliedDiscount: number;

    @ManyToOne(() => SaleStatusEntity)
    @JoinColumn({ name: 'estado_venta_id' })
    saleStatus: SaleStatusEntity;

    @Column({ type: 'date', name: 'fecha_entrega_aproximada' })
    estimatedDeliveryDate: Date;
}