import { Model, Types } from 'mongoose';
import { UserDocument } from './user.schema';
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
export declare class UserService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    createUser(data: {
        username: string;
        password: string;
        weight: number;
        height: number;
    }): Promise<UserWithoutPassword>;
    findByUsername(username: string): Promise<UserDocument | null>;
    getUser(id: string): Promise<UserWithoutPassword>;
    getAllUsers(): Promise<UserWithoutPassword[]>;
    updateLastActivity(userId: string): Promise<UserWithoutPassword>;
    updateUser(userId: string, updateData: Partial<UserDocument>): Promise<UserWithoutPassword>;
    updateStreak(userId: string): Promise<void>;
}
