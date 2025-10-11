import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WaterService } from './water.service';

@Controller('water')
export class WaterController {
  constructor(private waterService: WaterService) {}

  // Добавить порцию воды (только для авторизованного пользователя)
  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  async addPortion(@Request() req, @Body() body: { amount: number }) {
    const userId = req.user.userId;
    return this.waterService.addPortion(userId, body.amount);
  }

  // Все порции текущего пользователя
  @UseGuards(AuthGuard('jwt'))
  @Get('user/me')
  async getUserWater(@Request() req) {
    const userId = req.user.userId;
    return this.waterService.getUserWater(userId);
  }

  // Дневной баланс текущего пользователя
  @UseGuards(AuthGuard('jwt'))
  @Get('user/me/daily-total')
  async getDailyTotal(@Request() req) {
    const userId = req.user.userId;
    const total = await this.waterService.getDailyTotal(userId);
    const norm = await this.waterService.getUserDailyNorm(userId);
    return {
      totalConsumed: total,
      dailyNorm: norm,
      remaining: norm - total,
    };
  }

  // Месячный баланс текущего пользователя
  @UseGuards(AuthGuard('jwt'))
  @Get('user/me/monthly-total')
  async getMonthlyTotal(@Request() req) {
    const userId = req.user.userId;
    const total = await this.waterService.getMonthlyTotal(userId);
    const norm = await this.waterService.getUserMonthlyNorm(userId);
    return {
      totalConsumed: total,
      monthlyNorm: norm,
      remaining: norm - total,
    };
  }
}
