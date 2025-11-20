"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AchievementsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const event_emitter_1 = require("@nestjs/event-emitter");
const user_schema_1 = require("../user/user.schema");
const achievement_schema_1 = require("./achievement.schema");
const user_achievement_schema_1 = require("./user-achievement.schema");
let AchievementsService = AchievementsService_1 = class AchievementsService {
    userModel;
    achievementModel;
    userAchievementModel;
    eventEmitter;
    logger = new common_1.Logger(AchievementsService_1.name);
    achievementsMap = new Map();
    constructor(userModel, achievementModel, userAchievementModel, eventEmitter) {
        this.userModel = userModel;
        this.achievementModel = achievementModel;
        this.userAchievementModel = userAchievementModel;
        this.eventEmitter = eventEmitter;
    }
    async onModuleInit() {
        await this.initializeAchievements();
        this.setupEventListeners();
        this.logger.log('Achievements service initialized');
    }
    async initializeAchievements() {
        const achievements = [
            {
                id: 'first_sip',
                name: 'First Sip',
                description: 'Додайте першу порцію води',
                category: 'consumption',
                condition: 'first_portion',
                icon: '',
                points: 10
            },
            {
                id: 'first_goal',
                name: 'First Goal',
                description: 'Вперше досягніть денної норми',
                category: 'goal',
                condition: 'first_daily_goal',
                icon: '',
                points: 20
            },
            {
                id: 'back_again',
                name: 'Back Again',
                description: 'Повернення після 1 дня неактивності',
                category: 'consistency',
                condition: 'return_after_break',
                icon: '',
                points: 15
            },
            {
                id: '3_day_streak',
                name: '3-Day Streak',
                description: 'Досягніть денної норми 3 дні поспіль',
                category: 'streak',
                condition: 'streak_3_days',
                icon: '',
                points: 25
            },
            {
                id: '7_day_streak',
                name: '7-Day Streak',
                description: 'Досягніть денної норми 7 днів поспіль',
                category: 'streak',
                condition: 'streak_7_days',
                icon: '',
                points: 35
            },
            {
                id: '14_day_streak',
                name: '14-Day Streak',
                description: 'Досягніть денної норми 14 днів поспіль',
                category: 'streak',
                condition: 'streak_14_days',
                icon: '',
                points: 50
            },
            {
                id: '30_day_streak',
                name: '30-Day Streak',
                description: 'Досягніть денної норми 30 днів поспіль',
                category: 'streak',
                condition: 'streak_30_days',
                icon: '',
                points: 100
            },
            {
                id: '1_liter_club',
                name: '1 Liter Club',
                description: 'Спожийте загалом 1 літр води',
                category: 'consumption',
                condition: 'total_water_1_liter',
                icon: '',
                points: 15
            },
            {
                id: '10_liters_total',
                name: '10 Liters Total',
                description: 'Спожийте загалом 10 літрів води',
                category: 'consumption',
                condition: 'total_water_10_liters',
                icon: '',
                points: 30
            },
            {
                id: '100_liters_legend',
                name: '100 Liters Legend',
                description: 'Спожийте загалом 100 літрів води',
                category: 'consumption',
                condition: 'total_water_100_liters',
                icon: '',
                points: 75
            },
            {
                id: 'early_bird',
                name: 'Early Bird',
                description: 'Перший напій додано до 09:00',
                category: 'time',
                condition: 'first_drink_before_9am',
                icon: '',
                points: 20
            },
            {
                id: 'night_owl',
                name: 'Night Owl',
                description: 'Останній напій додано після 21:00',
                category: 'time',
                condition: 'last_drink_after_9pm',
                icon: '',
                points: 20
            },
            {
                id: 'healthy_habit',
                name: 'Healthy Habit',
                description: '5 днів поспіль без кофеїнованих напоїв',
                category: 'no_caffeine',
                condition: 'no_caffeine_5_days',
                icon: '',
                points: 35
            }
        ];
        for (const achievementData of achievements) {
            try {
                const achievement = await this.achievementModel.findOneAndUpdate({ id: achievementData.id }, achievementData, { upsert: true, new: true, setDefaultsOnInsert: true });
                if (achievement) {
                    this.achievementsMap.set(achievementData.condition, achievement);
                    this.logger.log(`Achievement ${achievementData.id} initialized`);
                }
            }
            catch (error) {
                this.logger.error(`Failed to initialize achievement ${achievementData.id}: ${error.message}`);
            }
        }
        this.logger.log('All achievements initialized');
    }
    setupEventListeners() {
        this.eventEmitter.on('water.added', (data) => this.handleWaterAdded(data));
        this.eventEmitter.on('goal.reached', (data) => this.handleGoalReached(data));
        this.eventEmitter.on('streak.updated', (data) => this.handleStreakUpdated(data));
        this.eventEmitter.on('user.login', (data) => this.handleUserLogin(data));
        this.logger.log('Achievement event listeners setup completed');
    }
    async handleWaterAdded(data) {
        try {
            const user = await this.userModel.findById(data.userId);
            if (!user) {
                this.logger.warn(`User ${data.userId} not found for water.added event`);
                return;
            }
            if (data.isFirstPortion) {
                await this.awardAchievement(data.userId, 'first_portion');
            }
            if (data.isFirstPortion) {
                const drinkTime = new Date(data.timestamp);
                if (drinkTime.getHours() < 9) {
                    await this.awardAchievement(data.userId, 'first_drink_before_9am');
                }
            }
            const drinkTime = new Date(data.timestamp);
            if (drinkTime.getHours() >= 21) {
                await this.awardAchievement(data.userId, 'last_drink_after_9pm');
            }
            const totalWaterLiters = user.totalWaterConsumed / 1000;
            if (totalWaterLiters >= 1) {
                await this.awardAchievement(data.userId, 'total_water_1_liter');
            }
            if (totalWaterLiters >= 10) {
                await this.awardAchievement(data.userId, 'total_water_10_liters');
            }
            if (totalWaterLiters >= 100) {
                await this.awardAchievement(data.userId, 'total_water_100_liters');
            }
        }
        catch (error) {
            this.logger.error(`Error in handleWaterAdded: ${error.message}`);
        }
    }
    async handleGoalReached(data) {
        try {
            const firstGoalAchievement = this.achievementsMap.get('first_daily_goal');
            if (!firstGoalAchievement) {
                this.logger.warn('First goal achievement not found');
                return;
            }
            const userAchievements = await this.userAchievementModel.find({
                userId: new mongoose_2.Types.ObjectId(data.userId),
                achievementId: firstGoalAchievement._id
            });
            if (userAchievements.length === 0) {
                await this.awardAchievement(data.userId, 'first_daily_goal');
            }
        }
        catch (error) {
            this.logger.error(`Error in handleGoalReached: ${error.message}`);
        }
    }
    async handleStreakUpdated(data) {
        try {
            if (data.currentStreak >= 3) {
                await this.awardAchievement(data.userId, 'streak_3_days');
            }
            if (data.currentStreak >= 7) {
                await this.awardAchievement(data.userId, 'streak_7_days');
            }
            if (data.currentStreak >= 14) {
                await this.awardAchievement(data.userId, 'streak_14_days');
            }
            if (data.currentStreak >= 30) {
                await this.awardAchievement(data.userId, 'streak_30_days');
            }
            if (data.currentNoCaffeineStreak >= 5) {
                await this.awardAchievement(data.userId, 'no_caffeine_5_days');
            }
        }
        catch (error) {
            this.logger.error(`Error in handleStreakUpdated: ${error.message}`);
        }
    }
    async handleUserLogin(data) {
        try {
            const user = await this.userModel.findById(data.userId);
            if (!user) {
                this.logger.warn(`User ${data.userId} not found for user.login event`);
                return;
            }
            const lastActivity = user.lastActivity;
            const now = new Date(data.timestamp);
            if (lastActivity) {
                const lastActivityDate = new Date(lastActivity);
                lastActivityDate.setHours(0, 0, 0, 0);
                const today = new Date(now);
                today.setHours(0, 0, 0, 0);
                const diffTime = Math.abs(today.getTime() - lastActivityDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays >= 1 && diffDays < 2) {
                    await this.awardAchievement(data.userId, 'return_after_break');
                }
            }
        }
        catch (error) {
            this.logger.error(`Error in handleUserLogin: ${error.message}`);
        }
    }
    async awardAchievement(userId, condition) {
        try {
            const achievement = this.achievementsMap.get(condition);
            if (!achievement) {
                this.logger.warn(`Achievement with condition ${condition} not found`);
                return;
            }
            const existing = await this.userAchievementModel.findOne({
                userId: new mongoose_2.Types.ObjectId(userId),
                achievementId: achievement._id
            });
            if (existing) {
                this.logger.log(`User ${userId} already has achievement ${achievement.name}`);
                return;
            }
            const userAchievement = new this.userAchievementModel({
                userId: new mongoose_2.Types.ObjectId(userId),
                achievementId: achievement._id,
                achievedAt: new Date()
            });
            await userAchievement.save();
            await this.userModel.findByIdAndUpdate(userId, {
                $addToSet: { achievements: achievement._id }
            });
            this.logger.log(`Achievement ${achievement.name} awarded to user ${userId}`);
            this.eventEmitter.emit('achievement.unlocked', {
                userId,
                achievement: {
                    id: achievement.id,
                    name: achievement.name,
                    description: achievement.description,
                    icon: achievement.icon,
                    points: achievement.points
                }
            });
        }
        catch (error) {
            this.logger.error(`Error awarding achievement: ${error.message}`);
        }
    }
    async getUserAchievements(userId) {
        try {
            const userAchievements = await this.userAchievementModel
                .find({ userId: new mongoose_2.Types.ObjectId(userId) })
                .populate('achievementId')
                .sort({ achievedAt: -1 })
                .exec();
            const allAchievements = await this.achievementModel.find().exec();
            const unlockedAchievements = userAchievements.map(ua => {
                const achievement = ua.achievementId;
                return {
                    id: achievement.id,
                    name: achievement.name,
                    description: achievement.description,
                    category: achievement.category,
                    icon: achievement.icon,
                    points: achievement.points,
                    achievedAt: ua.achievedAt,
                    unlocked: true
                };
            });
            const lockedAchievements = allAchievements
                .filter(ach => {
                return !userAchievements.some(ua => {
                    const achievement = ua.achievementId;
                    const achievementId = achievement._id ? achievement._id.toString() : '';
                    const achId = ach._id ? ach._id.toString() : '';
                    return achievementId === achId;
                });
            })
                .map(ach => ({
                id: ach.id,
                name: ach.name,
                description: ach.description,
                category: ach.category,
                icon: ach.icon,
                points: ach.points,
                unlocked: false
            }));
            const totalPoints = unlockedAchievements.reduce((sum, ua) => sum + ua.points, 0);
            const progress = allAchievements.length > 0 ?
                Math.round((unlockedAchievements.length / allAchievements.length) * 100) : 0;
            return {
                unlocked: unlockedAchievements,
                locked: lockedAchievements,
                stats: {
                    total: allAchievements.length,
                    unlocked: unlockedAchievements.length,
                    progress: progress,
                    totalPoints: totalPoints
                }
            };
        }
        catch (error) {
            this.logger.error(`Error getting user achievements: ${error.message}`);
            throw error;
        }
    }
    async checkAchievements(userId, actionType) {
        this.logger.log(`Manual achievement check for user ${userId}, action: ${actionType}`);
        try {
            const user = await this.userModel.findById(userId);
            if (user) {
                this.logger.log(`Manual check completed for user ${userId}`);
            }
        }
        catch (error) {
            this.logger.error(`Error in manual achievement check: ${error.message}`);
        }
    }
};
exports.AchievementsService = AchievementsService;
exports.AchievementsService = AchievementsService = AchievementsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(achievement_schema_1.Achievement.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_achievement_schema_1.UserAchievement.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        event_emitter_1.EventEmitter2])
], AchievementsService);
//# sourceMappingURL=achievements.service.js.map