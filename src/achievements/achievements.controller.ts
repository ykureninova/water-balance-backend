import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AchievementsService } from './achievements.service';

@Controller('achievements')
export class AchievementsController {
  constructor(private achievementsService: AchievementsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  async getUserAchievements(@Request() req) {
    return this.achievementsService.getUserAchievements(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my/progress')
  async getAchievementsProgress(@Request() req) {
    const achievements = await this.achievementsService.getUserAchievements(req.user.userId);
    return achievements.stats;
  }
}
