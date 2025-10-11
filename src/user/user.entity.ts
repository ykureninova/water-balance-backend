import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Water } from '../water/water.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string; // захэшированный пароль

  @Column('float')
  weight: number; // вес в кг

  @Column('float')
  height: number; // рост в см

  @Column('float')
  waterNorm: number; // норма воды в мл/день

  @OneToMany(() => Water, (water) => water.user)
  waters: Water[];
}