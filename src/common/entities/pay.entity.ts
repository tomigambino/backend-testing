import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('pagos')
export class PayEntity extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number; 

    @Column({ name: 'referencia_mp_id' })
    mpPreferenceId: string;

    @Column({ name: 'init_point_mp_id' })
    mpInitPoint: string;

    @Column({ name: 'payment_method_mp_id', nullable: true })
    mpPaymentMethod: string;

    @Column({ name: 'state_mp_id' })
    mpState: string;

    @Column({ name: 'monto', type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'timestamp', name: 'fecha_creacion' })
    creationDate: Date;

    @Column({ type: 'timestamp', name: 'fecha_aprobacion', nullable: true })
    approvalDate: Date;

    //Lo saco por ahora
    //@Column({name: 'divisa'})
    //currency: string
}