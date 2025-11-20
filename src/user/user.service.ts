import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';

export interface UserWithoutPassword {
  _id: Types.ObjectId;
  username: string;
  weight: number;
  height: number;
  lastActivity: Date;
  currentStreak: number;
  lastGoalDate?: Date;
  currentNoCaffeineStreak: number;
  lastNoCaffeineDate?: Date;
  totalWaterConsumed: number;
}

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(data: {
    username: string;
    password: string;
    weight: number;
    height: number;
  }): Promise<UserWithoutPassword> {
    const existing = await this.userModel.findOne({ username: data.username }).exec();
    if (existing) throw new ConflictException('Username already exists');

    const user = new this.userModel(data);
    const savedUser = await user.save();
    
    const userObject = savedUser.toObject();
    const { password, ...result } = userObject;
    return result as UserWithoutPassword;
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).select('+password').exec();
  }

  async getUser(id: string): Promise<UserWithoutPassword> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    
    const userObject = user.toObject();
    const { password, ...result } = userObject;
    return result as UserWithoutPassword;
  }

  async getAllUsers(): Promise<UserWithoutPassword[]> {
    const users = await this.userModel.find().exec();
    return users.map(user => {
      const userObject = user.toObject();
      const { password, ...result } = userObject;
      return result as UserWithoutPassword;
    });
  }

  async updateLastActivity(userId: string): Promise<UserWithoutPassword> {
    const user = await this.userModel.findByIdAndUpdate(
      userId, 
      { lastActivity: new Date() },
      { new: true }
    ).exec();
    
    if (!user) throw new NotFoundException('User not found');
    
    const userObject = user.toObject();
    const { password, ...result } = userObject;
    return result as UserWithoutPassword;
  }

  async updateUser(userId: string, updateData: Partial<UserDocument>): Promise<UserWithoutPassword> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).exec();
    
    if (!user) throw new NotFoundException('User not found');
    
    const userObject = user.toObject();
    const { password, ...result } = userObject;
    return result as UserWithoutPassword;
  }

  async updateStreak(userId: string): Promise<void> {
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
  }
}
