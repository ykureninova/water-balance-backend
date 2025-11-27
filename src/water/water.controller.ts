import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WaterService } from './water.service';
import { AchievementService } from '../achievement/achievement.service';

@Controller('water')
export class WaterController {
  constructor(
    private waterService: WaterService,
    private achievementService: AchievementService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  async addPortion(
    @Request() req,
    @Body() body: { amount: number; drinkType: string },
  ) {
    console.log('ADD DRINK BODY:', body);
    console.log('USER:', req.user);

    // 1. Збираємо ачивки ДО
    const before = await this.achievementService.getUserAchievements(
      req.user.userId,
    );

    // 2. Зберігаємо воду
    const saved = await this.waterService.addPortion(
      req.user.userId,
      body.amount,
      body.drinkType,
    );

    // 3. Запускаємо нарахування ачивок
    await this.achievementService.checkOnWaterAdd(req.user.userId);

    // 4. Ачивки ПІСЛЯ
    const after = await this.achievementService.getUserAchievements(
      req.user.userId,
    );

    // 5. Нові ачивки
    const newOnes = after.filter(
      (a) => !before.some((b) => b.code === a.code),
    );

    return {
      saved,
      newAchievements: newOnes,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/me')
  async getUserWater(@Request() req) {
    return this.waterService.getUserWater(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/me/stats')
  async getStats(
    @Request() req,
    @Query('range') range: 'd' | 'w' | 'm' | 'y' = 'd',
  ) {
    return this.waterService.getStats(req.user.userId, range);
  }
}
