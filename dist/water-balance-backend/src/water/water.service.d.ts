import { Model } from 'mongoose';
import { WaterDocument } from './water.schema';
import { UserDocument } from '../user/user.schema';
export declare class WaterService {
    private waterModel;
    private userModel;
    constructor(waterModel: Model<WaterDocument>, userModel: Model<UserDocument>);
    addPortion(userId: string, amount: number): Promise<WaterDocument>;
    getUserWater(userId: string): Promise<WaterDocument[]>;
    getDailyTotal(userId: string): Promise<number>;
    getMonthlyTotal(userId: string): Promise<number>;
    getUserDailyNorm(userId: string): Promise<number>;
    getUserMonthlyNorm(userId: string): Promise<number>;
}
