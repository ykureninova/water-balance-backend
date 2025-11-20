import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(data: {
    username: string;
    password: string;
    weight: number;
    height: number;
  }): Promise<UserDocument> {
    const existing = await this.userModel.findOne({ username: data.username }).exec();
    if (existing) throw new ConflictException('Username already exists');

    const user = new this.userModel(data);
    return user.save();
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async getUser(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async updateLastActivity(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(
      userId, 
      { lastActivity: new Date() },
      { new: true }
    ).exec();
    
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(userId: string, updateData: Partial<UserDocument>): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).exec();
    
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}


