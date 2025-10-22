import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'nombre', unique: true })
  name: string; //Ej: Admin, user

}