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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaterService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const water_schema_1 = require("./water.schema");
const user_schema_1 = require("../user/user.schema");
let WaterService = class WaterService {
    waterModel;
    userModel;
    constructor(waterModel, userModel) {
        this.waterModel = waterModel;
        this.userModel = userModel;
    }
    async addPortion(userId, amount) {
        const user = await this.userModel.findById(userId).exec();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const portion = new this.waterModel({ user: user._id, amount });
        return portion.save();
    }
    async getUserWater(userId) {
        return this.waterModel
            .find({ user: userId })
            .sort({ createdAt: -1 })
            .exec();
    }
    async getDailyTotal(userId) {
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
    async getMonthlyTotal(userId) {
        const today = new Date();
        const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const portions = await this.waterModel.find({
            user: userId,
            createdAt: { $gte: startMonth, $lt: endMonth },
        });
        return portions.reduce((sum, p) => sum + p.amount, 0);
    }
    async getUserDailyNorm(userId) {
        const user = await this.userModel.findById(userId).exec();
        return user?.weight ? user.weight * 35 : 0;
    }
    async getUserMonthlyNorm(userId) {
        const user = await this.userModel.findById(userId).exec();
        if (!user?.weight)
            return 0;
        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        return user.weight * 35 * daysInMonth;
    }
};
exports.WaterService = WaterService;
exports.WaterService = WaterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(water_schema_1.Water.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], WaterService);
//# sourceMappingURL=water.service.js.map