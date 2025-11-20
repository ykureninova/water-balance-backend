import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WaterDocument } from './water.schema';
import { UserDocument } from '../user/user.schema';
export declare class WaterService {
    private waterModel;
    private userModel;
    private eventEmitter;
    constructor(waterModel: Model<WaterDocument>, userModel: Model<UserDocument>, eventEmitter: EventEmitter2);
    addPortion(userId: string, amount: number, isCaffeinated?: boolean): Promise<WaterDocument>;
    getUserWater(userId: string): Promise<WaterDocument[]>;
    getDailyTotal(userId: string): Promise<number>;
    getMonthlyTotal(userId: string): Promise<number>;
    getUserDailyNorm(userId: string): Promise<number>;
    getUserMonthlyNorm(userId: string): Promise<number>;
    private updateStreak;
    private updateNoCaffeineStreak;
    private resetNoCaffeineStreak;
}
