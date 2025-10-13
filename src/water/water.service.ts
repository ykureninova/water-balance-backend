import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Water, WaterDocument } from './water.schema';
import { UserDocument, User } from '../user/user.schema';
import { Types } from 'mongoose';

@Injectable()
export class WaterService {
  constructor(
    @InjectModel(Water.name) private waterModel: Model<WaterDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async addPortion(userId: string, amount: number): Promise<WaterDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User not found');

    const portion = new this.waterModel({ user: user._id, amount });
    return portion.save();
  }

  async getUserWater(userId: string): Promise<WaterDocument[]> {
    return this.waterModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getDailyTotal(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const portions = await this.waterModel.find({
      user: userId,
      createdAt: { $gte: today, $lt: tomorrow },
    });

    return portions.reduce((sum, p) => sum + p.amount, 0);
  }

  async getMonthlyTotal(userId: string): Promise<number> {
    const today = new Date();
    const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const portions = await this.waterModel.find({
      user: userId,
      createdAt: { $gte: startMonth, $lt: endMonth },
    });

    return portions.reduce((sum, p) => sum + p.amount, 0);
  }

  async getUserDailyNorm(userId: string): Promise<number> {
    const user = await this.userModel.findById(userId).exec();
    return user?.weight ? user.weight * 35 : 0;
  }

  async getUserMonthlyNorm(userId: string): Promise<number> {
    const user = await this.userModel.findById(userId).exec();
    if (!user?.weight) return 0;

    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    return user.weight * 35 * daysInMonth;
  }
}
