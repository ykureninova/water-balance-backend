import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Water, WaterDocument } from './water.schema';
import { UserDocument, User } from '../user/user.schema';

@Injectable()
export class WaterService {
  constructor(
    @InjectModel(Water.name) private waterModel: Model<WaterDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  async addPortion(userId: string, amount: number, isCaffeinated: boolean = false): Promise<WaterDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User not found');
    const existingPortionsCount = await this.waterModel.countDocuments({ user: userId });
    const isFirstPortion = existingPortionsCount === 0;
    const timestamp = new Date();

    const portion = new this.waterModel({ 
      user: user._id, 
      amount,
      isCaffeinated,
      createdAt: timestamp
    });
    
    const savedPortion = await portion.save();
    const updatedUser = await this.userModel.findByIdAndUpdate(userId, {
      $inc: { totalWaterConsumed: amount },
      lastActivity: timestamp
    }, { new: true });
    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }

    await this.updateStreak(userId);

    if (!isCaffeinated) {
      await this.updateNoCaffeineStreak(userId);
    } else {
      await this.resetNoCaffeineStreak(userId);
    }
    this.eventEmitter.emit('water.added', { 
      userId, 
      amount, 
      isFirstPortion,
      timestamp
    });
    const dailyTotal = await this.getDailyTotal(userId);
    const dailyNorm = await this.getUserDailyNorm(userId);
    if (dailyTotal >= dailyNorm) {
      this.eventEmitter.emit('goal.reached', { 
        userId,
        timestamp 
      });
    }
    this.eventEmitter.emit('streak.updated', {
      userId,
      currentStreak: updatedUser!.currentStreak,
      currentNoCaffeineStreak: updatedUser!.currentNoCaffeineStreak,
      timestamp
    });

    return savedPortion;
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
    return user?.weight ? user.weight * 35 : 2000;
  }

  async getUserMonthlyNorm(userId: string): Promise<number> {
    const user = await this.userModel.findById(userId).exec();
    if (!user?.weight) return 0;

    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    return user.weight * 35 * daysInMonth;
  }

  private async updateStreak(userId: string): Promise<void> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastActivity = user.lastActivity ? new Date(user.lastActivity) : null;
      
      if (lastActivity) {
        lastActivity.setHours(0, 0, 0, 0);
        const dayDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          await this.userModel.findByIdAndUpdate(userId, {
            $inc: { currentStreak: 1 },
            lastActivity: new Date()
          });
        } else if (dayDiff > 1) {
          await this.userModel.findByIdAndUpdate(userId, {
            currentStreak: 1,
            lastActivity: new Date()
          });
        }
      } else {
        await this.userModel.findByIdAndUpdate(userId, {
          currentStreak: 1,
          lastActivity: new Date()
        });
      }
    } catch (error: any) {
      console.error('Error updating streak:', error.message);
    }
  }

  private async updateNoCaffeineStreak(userId: string): Promise<void> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastNoCaffeineDate = user.lastNoCaffeineDate ? new Date(user.lastNoCaffeineDate) : null;
      
      if (lastNoCaffeineDate) {
        lastNoCaffeineDate.setHours(0, 0, 0, 0);
        const dayDiff = Math.floor((today.getTime() - lastNoCaffeineDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          await this.userModel.findByIdAndUpdate(userId, {
            $inc: { currentNoCaffeineStreak: 1 },
            lastNoCaffeineDate: new Date()
          });
        } else if (dayDiff > 1) {
          await this.userModel.findByIdAndUpdate(userId, {
            currentNoCaffeineStreak: 1,
            lastNoCaffeineDate: new Date()
          });
        }
      } else {
        await this.userModel.findByIdAndUpdate(userId, {
          currentNoCaffeineStreak: 1,
          lastNoCaffeineDate: new Date()
        });
      }
    } catch (error: any) {
      console.error('Error updating no caffeine streak:', error.message);
    }
  }

  private async resetNoCaffeineStreak(userId: string): Promise<void> {
    try {
      await this.userModel.findByIdAndUpdate(userId, {
        currentNoCaffeineStreak: 0,
        lastNoCaffeineDate: null
      });
    } catch (error: any) {
      console.error('Error resetting no caffeine streak:', error.message);
    }
  }
}
