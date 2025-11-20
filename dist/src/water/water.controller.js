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
exports.WaterController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const water_service_1 = require("./water.service");
let WaterController = class WaterController {
    waterService;
    constructor(waterService) {
        this.waterService = waterService;
    }
    async addPortion(req, body) {
        const userId = req.user.userId;
        const isCaffeinated = body.isCaffeinated || false;
        return this.waterService.addPortion(userId, body.amount, isCaffeinated);
    }
    async getUserWater(req) {
        const userId = req.user.userId;
        return this.waterService.getUserWater(userId);
    }
    async getDailyTotal(req) {
        const userId = req.user.userId;
        const total = await this.waterService.getDailyTotal(userId);
        const norm = await this.waterService.getUserDailyNorm(userId);
        return {
            totalConsumed: total,
            dailyNorm: norm,
            remaining: Math.max(0, norm - total),
        };
    }
    async getMonthlyTotal(req) {
        const userId = req.user.userId;
        const total = await this.waterService.getMonthlyTotal(userId);
        const norm = await this.waterService.getUserMonthlyNorm(userId);
        return {
            totalConsumed: total,
            monthlyNorm: norm,
            remaining: Math.max(0, norm - total),
        };
    }
};
exports.WaterController = WaterController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('add'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WaterController.prototype, "addPortion", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('user/me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WaterController.prototype, "getUserWater", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('user/me/daily-total'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WaterController.prototype, "getDailyTotal", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('user/me/monthly-total'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WaterController.prototype, "getMonthlyTotal", null);
exports.WaterController = WaterController = __decorate([
    (0, common_1.Controller)('water'),
    __metadata("design:paramtypes", [water_service_1.WaterService])
], WaterController);
//# sourceMappingURL=water.controller.js.map