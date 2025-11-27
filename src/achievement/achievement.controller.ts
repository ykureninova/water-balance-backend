import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('achievements')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('user/me')
  async getUserAchievements(@Request() req) {
    return this.achievementService.getUserAchievements(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/me/streak')
  async getWeeklyStreak(@Request() req) {
    return this.achievementService.getWeeklyStreak(req.user.userId);
  }
}
