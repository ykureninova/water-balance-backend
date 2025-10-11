import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Water {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.waters)
  user: User;

  @Column('float')
  amount: number; // количество воды в мл

  @CreateDateColumn()
  createdAt: Date;
}