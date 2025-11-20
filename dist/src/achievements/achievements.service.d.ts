import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserDocument } from '../user/user.schema';
import { AchievementDocument } from './achievement.schema';
import { UserAchievementDocument } from './user-achievement.schema';
export declare class AchievementsService implements OnModuleInit {
    private userModel;
    private achievementModel;
    private userAchievementModel;
    private eventEmitter;
    private readonly logger;
    private achievementsMap;
    constructor(userModel: Model<UserDocument>, achievementModel: Model<AchievementDocument>, userAchievementModel: Model<UserAchievementDocument>, eventEmitter: EventEmitter2);
    onModuleInit(): Promise<void>;
    private initializeAchievements;
    private setupEventListeners;
    private handleWaterAdded;
    private handleGoalReached;
    private handleStreakUpdated;
    private handleUserLogin;
    private awardAchievement;
    getUserAchievements(userId: string): Promise<any>;
    checkAchievements(userId: string, actionType: string): Promise<void>;
}
