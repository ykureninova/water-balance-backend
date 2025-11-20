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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./user.schema");
let UserService = class UserService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async createUser(data) {
        const existing = await this.userModel.findOne({ username: data.username }).exec();
        if (existing)
            throw new common_1.ConflictException('Username already exists');
        const user = new this.userModel(data);
        const savedUser = await user.save();
        const userObject = savedUser.toObject();
        const { password, ...result } = userObject;
        return result;
    }
    async findByUsername(username) {
        return this.userModel.findOne({ username }).select('+password').exec();
    }
    async getUser(id) {
        const user = await this.userModel.findById(id).exec();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const userObject = user.toObject();
        const { password, ...result } = userObject;
        return result;
    }
    async getAllUsers() {
        const users = await this.userModel.find().exec();
        return users.map(user => {
            const userObject = user.toObject();
            const { password, ...result } = userObject;
            return result;
        });
    }
    async updateLastActivity(userId) {
        const user = await this.userModel.findByIdAndUpdate(userId, { lastActivity: new Date() }, { new: true }).exec();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const userObject = user.toObject();
        const { password, ...result } = userObject;
        return result;
    }
    async updateUser(userId, updateData) {
        const user = await this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const userObject = user.toObject();
        const { password, ...result } = userObject;
        return result;
    }
    async updateStreak(userId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            return;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastActivity = user.lastActivity ? new Date(user.lastActivity) : null;
        if (lastActivity) {
            lastActivity.setHours(0, 0, 0, 0);
            const dayDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
            if (dayDiff === 1) {
                await this.userModel.findByIdAndUpdate(userId, {
                    $inc: { currentStreak: 1 },
                    lastActivity: new Date()
                });
            }
            else if (dayDiff > 1) {
                await this.userModel.findByIdAndUpdate(userId, {
                    currentStreak: 1,
                    lastActivity: new Date()
                });
            }
        }
        else {
            await this.userModel.findByIdAndUpdate(userId, {
                currentStreak: 1,
                lastActivity: new Date()
            });
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserService);
//# sourceMappingURL=user.service.js.map