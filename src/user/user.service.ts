import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // Создание пользователя
  async createUser(data: {
    username: string;
    password: string;
    weight: number;
    height: number;
    waterNorm: number;
  }) {
    // Проверка, есть ли уже такой username
    const existing = await this.findByUsername(data.username);
    if (existing) {
      throw new Error('Username already exists');
    }

    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  // Поиск пользователя по username
  async findByUsername(username: string) {
    return this.userRepo.findOneBy({ username });
  }

  async getUser(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  async getAllUsers() {
    return this.userRepo.find();
  }
}
