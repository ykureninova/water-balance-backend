import { WaterService } from './water.service';
export declare class WaterController {
    private waterService;
    constructor(waterService: WaterService);
    addPortion(req: any, body: {
        amount: number;
        isCaffeinated?: boolean;
    }): Promise<import("./water.schema").WaterDocument>;
    getUserWater(req: any): Promise<import("./water.schema").WaterDocument[]>;
    getDailyTotal(req: any): Promise<{
        totalConsumed: number;
        dailyNorm: number;
        remaining: number;
    }>;
    getMonthlyTotal(req: any): Promise<{
        totalConsumed: number;
        monthlyNorm: number;
        remaining: number;
    }>;
}
