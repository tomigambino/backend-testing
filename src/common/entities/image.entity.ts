import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('images')
export class ImageEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column({name: 'url'})
    url: string

    @Column({name: 'nombre_archivo'})
    name: string

    @Column({name: 'tamaño'})
    size: string
    
}