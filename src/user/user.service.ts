import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createUser(data: {
    username: string;
    password: string;
    email?: string;
    gender?: 'male' | 'female';
    weight?: number;
    height?: number;
    activity?: number;
    waterNorm?: number;
  }): Promise<UserDocument> {
    const existing = await this.userModel
      .findOne({ username: data.username })
      .exec();
    if (existing) throw new ConflictException('Username already exists');

    const user = new this.userModel({
      username: data.username,
      password: data.password,
      email: data.email ?? null,
      gender: data.gender ?? 'female',
      weight: data.weight ?? null,
      height: data.height ?? null,
      activity: data.activity ?? null,
      waterNorm: data.waterNorm ?? 2000,
    });

    return user.save();
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByUsernameOrEmail(
    identifier: string,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        $or: [{ username: identifier }, { email: identifier }],
      })
      .exec();
  }

  async getUser(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async updateUserSettings(
    userId: string,
    data: {
      username?: string;
      email?: string;
      password?: string;
      gender?: 'male' | 'female';
      weight?: number;
      height?: number;
      activity?: number;
      waterNorm?: number;
    },
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('User not found');

    // username
    if (data.username && data.username !== user.username) {
      const existing = await this.userModel
        .findOne({ username: data.username })
        .exec();
      if (existing && existing._id.toString() !== userId) {
        throw new ConflictException('Username already exists');
      }
      user.username = data.username;
    }

    // email
    if (data.email && data.email !== user.email) {
      const existingEmail = await this.userModel
        .findOne({ email: data.email })
        .exec();
      if (existingEmail && existingEmail._id.toString() !== userId) {
        throw new ConflictException('Email already exists');
      }
      user.email = data.email;
    }

    // password
    if (data.password) {
      const hashed = await bcrypt.hash(data.password, 10);
      user.password = hashed;
    }

    // інші поля
    if (data.gender) user.gender = data.gender;
    if (typeof data.weight === 'number') user.weight = data.weight;
    if (typeof data.height === 'number') user.height = data.height;
    if (typeof data.activity === 'number') user.activity = data.activity;
    if (typeof data.waterNorm === 'number') user.waterNorm = data.waterNorm;

    return user.save();
  }
}
