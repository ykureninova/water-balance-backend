import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Water } from './water.entity';
import { User } from '../user/user.entity';

@Injectable()
export class WaterService {
  constructor(
    @InjectRepository(Water)
    private waterRepo: Repository<Water>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async addPortion(userId: number, amount: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const portion = this.waterRepo.create({ user, amount });
    return this.waterRepo.save(portion);
  }

  async getUserWater(userId: number) {
    return this.waterRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getDailyTotal(userId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const portions = await this.waterRepo.find({
      where: {
        user: { id: userId },
        createdAt: Between(today, tomorrow),
      },
    });

    return portions.reduce((sum, p) => sum + p.amount, 0);
  }

  async getMonthlyTotal(userId: number) {
    const today = new Date();
    const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const portions = await this.waterRepo.find({
      where: {
        user: { id: userId },
        createdAt: Between(startMonth, endMonth),
      },
    });

    return portions.reduce((sum, p) => sum + p.amount, 0);
  }
  
   async getUserDailyNorm(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    return user ? user.weight * 35 : 0; // мл/день
  }

  async getUserMonthlyNorm(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return 0;

    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    return user.weight * 35 * daysInMonth; // мл/месяц
  }
}
